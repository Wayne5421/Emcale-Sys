// ordens.component.ts
import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-ordens',
  templateUrl: './ordens.component.html',
  styleUrls: ['./ordens.component.css'],
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule]
})
export class OrdensComponent implements OnInit {
  ordens: any[] = [];
  filteredOrdens: any[] = [];
  erro: string = '';
  searchTerm: string = '';
  ordemSelecionada: any = null;
  mostrarModalEditar: boolean = false;
  mostrarModalCriar: boolean = false;
  novaOrdem: any = {
    wo_projeto: '',
    cidade: '',
    regional: '',
    escopo: '',
    premissas: '',
    data_abertura: new Date(),
    prazo: new Date(),
    id_tecnico: null
  };
  permissaoLogada: string = '';
  tecnicos: any[] = []; // Para popular o select de técnicos

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const permissao = localStorage.getItem('permissao');
    this.permissaoLogada = permissao || '';

    if (!token) {
      this.erro = 'Token de autenticação não encontrado. Faça login novamente.';
      return;
    }

    this.carregarOrdens(token);
    this.carregarTecnicos(token);
  }

  carregarOrdens(token: string): void {
    this.dataService.listarOrdens(token).subscribe({
      next: (response) => {
        this.ordens = response.ordens_servico || [];
        this.filteredOrdens = this.ordens;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar ordens de serviço. Verifique a autenticação.';
        console.error(err);
      }
    });
  }

  carregarTecnicos(token: string): void {
    this.dataService.listarTecnicos(token).subscribe({
      next: (response) => {
        this.tecnicos = response.tecnicos || [];
      },
      error: (err) => {
        console.error('Erro ao carregar técnicos:', err);
      }
    });
  }

  filterAndSortOrdens(): void {
    let filtered = this.ordens;

    if (this.searchTerm) {
      filtered = filtered.filter(ordem =>
        ordem.wo_projeto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (ordem.cidade && ordem.cidade.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (ordem.regional && ordem.regional.toLowerCase().includes(this.searchTerm.toLowerCase())) ||
        (ordem.escopo && ordem.escopo.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    this.filteredOrdens = filtered;
  }

  abrirModalEditar(ordem: any): void {
    if (this.permissaoLogada === 'admin' || this.permissaoLogada === 'dev') {
      this.ordemSelecionada = { ...ordem };
      this.ordemSelecionada.data_abertura = new Date(ordem.data_abertura);
      this.ordemSelecionada.prazo = new Date(ordem.prazo);
      this.mostrarModalEditar = true;
    }
  }

  fecharModalEditar(): void {
    this.mostrarModalEditar = false;
  }

  salvarAlteracoes(): void {
    const token = localStorage.getItem('token');
    if (!token || !this.ordemSelecionada) return;

    // Formate as datas para 'YYYY-MM-DD' antes de enviar
    const dataAberturaFormatada = formatDate(this.ordemSelecionada.data_abertura, 'yyyy-MM-dd', 'en-US');
    const prazoFormatado = formatDate(this.ordemSelecionada.prazo, 'yyyy-MM-dd', 'en-US');
    const ordemParaEnviar = {
      ...this.ordemSelecionada,
      data_abertura: dataAberturaFormatada,
      prazo: prazoFormatado
    };

    this.dataService.atualizarOrdem(this.ordemSelecionada.id, ordemParaEnviar, token).subscribe({
      next: () => {
        alert('Ordem de serviço atualizada com sucesso!');
        this.mostrarModalEditar = false;
        this.carregarOrdens(token); // Recarrega as ordens
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao atualizar ordem de serviço.');
      }
    });
  }

  confirmarDelecao(id: number, event: Event): void {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja deletar esta ordem de serviço?')) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.erro = 'Token de autenticação não encontrado.';
        return;
      }
      this.dataService.deletarOrdem(id, token).subscribe({
        next: () => {
          alert('Ordem de serviço deletada com sucesso!');
          this.ordens = this.ordens.filter(ordem => ordem.id !== id);
          this.filteredOrdens = this.filteredOrdens.filter(ordem => ordem.id !== id);
        },
        error: (err) => {
          console.error(err);
          alert('Erro ao deletar ordem de serviço.');
        }
      });
    }
  }

  abrirModalCriar(): void {
    this.novaOrdem = {
      wo_projeto: '',
      cidade: '',
      regional: '',
      escopo: '',
      premissas: '',
      data_abertura: new Date(),
      prazo: new Date(),
      id_tecnico: null
    };
    this.mostrarModalCriar = true;
  }

  fecharModalCriar(): void {
    this.mostrarModalCriar = false;
  }

  salvarNovaOrdem(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const dataAberturaFormatada = formatDate(this.novaOrdem.data_abertura, 'yyyy-MM-dd', 'en-US');
    const prazoFormatado = formatDate(this.novaOrdem.prazo, 'yyyy-MM-dd', 'en-US');
    const novaOrdemParaEnviar = { ...this.novaOrdem, data_abertura: dataAberturaFormatada, prazo: prazoFormatado };

    this.dataService.criarOrdem(novaOrdemParaEnviar, token).subscribe({
      next: () => {
        alert('Ordem de serviço criada com sucesso!');
        this.mostrarModalCriar = false;
        this.carregarOrdens(token); 
      },
      error: (err) => {
        console.error(err);
        alert('Erro ao criar ordem de serviço.');
      }
    });
  }


  isPrazoCritico(prazo: string): boolean {
  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  const diffTime = dataPrazo.getTime() - hoje.getTime();
  const diffDias = diffTime / (1000 * 60 * 60 * 24);
  return diffDias < 5;
}


calcularDiasRestantes(prazo: string | Date): number {
  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  const diffTime = dataPrazo.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDias;
}


  
}