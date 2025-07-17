import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgSelectModule]
})
export class UsersComponent implements OnInit {
  usuarios: any[] = [];
  filteredUsers: any[] = [];
  erro: string = '';
  searchQuery: string = '';
  selectedPermission: string = '';
  usuarioSelecionado: any = null;
  mostrarModal: boolean = false;
  mostrarModalCriar: boolean = false;
  novoUsuario: any = { nome_completo: '', usuario: '', senha: '', permissao: '' };
  permissaoLogada: string = '';


  permissoesDisponiveis: string[] = [];

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

ngOnInit(): void {
  const token = localStorage.getItem('token');
  const permissao = localStorage.getItem('permissao');
  this.permissaoLogada = permissao || '';

  if (!token) {
    this.erro = 'Token de autenticação não encontrado. Por favor, faça login novamente.';
    return;
  }


  this.dataService.listarUsuarios(token).subscribe({
    next: (response) => {
      this.usuarios = response.usuarios || [];
      this.filteredUsers = this.usuarios;
    },
    error: (error) => {
      this.erro = 'Erro ao carregar os usuários. Verifique a autenticação.';
      console.error(error);
    }
  });


this.dataService.listarPermissoes(token).subscribe({
  next: (res) => {
    this.permissoesDisponiveis = res.permissoes.map((p: { nome: any; }) => p.nome);
  },
  error: (err) => {
    console.error('Erro ao carregar permissões:', err);
  }
});




}


  filterUsers(): void {
    let filtered = this.usuarios;

    if (this.searchQuery) {
      filtered = filtered.filter((usuario) =>
        usuario.usuario.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.nome_completo.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    if (this.selectedPermission) {
      filtered = filtered.filter((usuario) => usuario.permissao.toLowerCase() === this.selectedPermission.toLowerCase());
    }

    this.filteredUsers = filtered;
  }

formatPermission(permission: string): string {
  switch (permission.toLowerCase()) {
    case 'admin':
      return 'Administrador';
    case 'dev':
      return 'Desenvolvedor';
    case 'default':
      return 'Padrão';
    case 'financeiro':
      return 'Financeiro';
    default:

      return permission.charAt(0).toUpperCase() + permission.slice(1);
  }
}

  abrirModal(usuario: any): void {
    if (this.permissaoLogada === 'admin' || this.permissaoLogada === 'dev') {
      this.usuarioSelecionado = { ...usuario };
      console.log('Abrindo modal para usuário:', this.usuarioSelecionado);
      this.mostrarModal = true;
    }
  }


  fecharModal(): void {
    this.mostrarModal = false;
  }

  salvarAlteracoes(): void {
    const token = localStorage.getItem('token');
    if (!token || !this.usuarioSelecionado) return;

    this.dataService.atualizarUsuario(this.usuarioSelecionado.id, this.usuarioSelecionado, token)
      .subscribe({
        next: (res) => {
          alert('Usuário atualizado com sucesso!');
          this.mostrarModal = false;
          location.reload();
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao atualizar usuário.');
        }
      });
  }

  confirmarDelecao(id: number, event: Event): void {
    event.stopPropagation();
    const confirmation = confirm('Tem certeza que deseja deletar este usuário?');
    if (confirmation) {
      const token = localStorage.getItem('token');


      if (!token) {
        this.erro = 'Token de autenticação não encontrado. Por favor, faça login novamente.';
        return;
      }

      this.dataService.deletarUsuario(id, token).subscribe({
        next: (response) => {
          alert(response.message);
          this.usuarios = this.usuarios.filter((user) => user.id !== id);
          this.filteredUsers = this.filteredUsers.filter((user) => user.id !== id);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao deletar usuário.');
        }
      });
    }
  }

  abrirModalCriarUsuario(): void {
    this.novoUsuario = { nome_completo: '', usuario: '', senha: '', permissao: '' };
    this.mostrarModalCriar = true;
  }

  fecharModalCriar(): void {
    this.mostrarModalCriar = false;
  }

  salvarNovoUsuario(): void {
    const token = localStorage.getItem('token');
    if (!token || !this.novoUsuario) return;

    this.dataService.criarUsuario(this.novoUsuario, token).subscribe({
      next: (res) => {
        alert('Usuário criado com sucesso!');
        this.mostrarModalCriar = false;
        location.reload(); // recarrega lista
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar o usuário.');
      }
    });
  }

}
