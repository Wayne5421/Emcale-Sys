// tecnicos.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-tecnicos',
  templateUrl: './tecnicos.component.html',
  styleUrls: ['./tecnicos.component.css'],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule]
})
export class TecnicosComponent implements OnInit {
  tecnicos: any[] = [];
  filteredTecnicos: any[] = [];
  erro: string = '';
  searchTerm: string = '';
  tecnicoSelecionado: any = null;
  mostrarModalEditar: boolean = false;
  mostrarModalCriar: boolean = false;
  novoTecnico: any = { nome: '', telefone: '', email: '' };
  permissaoLogada: string = '';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const permissao = localStorage.getItem('permissao');
    this.permissaoLogada = permissao || '';

    if (!token) {
      this.erro = 'Token de autenticação não encontrado. Faça login novamente.';
      return;
    }

    this.dataService.listarTecnicos(token).subscribe({
      next: (response) => {
        this.tecnicos = response.tecnicos || [];
        this.filteredTecnicos = this.tecnicos;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar técnicos. Verifique a autenticação.';
        console.error(err);
      }
    });
  }

  filterAndSortTecnicos(): void {
    let filtered = this.tecnicos;

    if (this.searchTerm) {
      filtered = filtered.filter(t =>
        t.nome.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredTecnicos = filtered;
  }

  abrirModalEditar(tecnico: any): void {
    if (this.permissaoLogada === 'admin' || this.permissaoLogada === 'dev') {
      this.tecnicoSelecionado = { ...tecnico };
      this.mostrarModalEditar = true;
    }
  }

  fecharModalEditar(): void {
    this.mostrarModalEditar = false;
  }

  salvarAlteracoes(): void {
    const token = localStorage.getItem('token');
    if (!token || !this.tecnicoSelecionado) return;

    this.dataService.atualizarTecnico(this.tecnicoSelecionado.id, this.tecnicoSelecionado, token).subscribe({
      next: () => {
        alert('Técnico atualizado com sucesso!');
        this.mostrarModalEditar = false;
        location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao atualizar técnico.');
      }
    });
  }

  confirmarDelecao(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja deletar este técnico?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.erro = 'Token de autenticação não encontrado.';
        return;
      }
      this.dataService.deletarTecnico(id, token).subscribe({
        next: () => {
          alert('Técnico deletado com sucesso!');
          this.tecnicos = this.tecnicos.filter(t => t.id !== id);
          this.filteredTecnicos = this.filteredTecnicos.filter(t => t.id !== id);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao deletar técnico.');
        }
      });
    }
  }

  abrirModalCriar(): void {
    this.novoTecnico = { nome: '', telefone: '', email: '' };
    this.mostrarModalCriar = true;
  }

  fecharModalCriar(): void {
    this.mostrarModalCriar = false;
  }

  salvarNovoTecnico(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    this.dataService.criarTecnico(this.novoTecnico, token).subscribe({
      next: () => {
        alert('Técnico criado com sucesso!');
        this.mostrarModalCriar = false;
        location.reload();
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar técnico.');
      }
    });
  }
}
