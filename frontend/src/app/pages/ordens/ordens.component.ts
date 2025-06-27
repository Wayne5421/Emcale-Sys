import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonModule, formatDate } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-ordens',
  templateUrl: './ordens.component.html',
  styleUrls: ['./ordens.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ]
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
    prazo_desktop: new Date(),
    prazo_tecnico: new Date(),
    id_status: null, 
    id_tecnico: null,
    observacao: ''
  };

  permissaoLogada: string = '';
  tecnicos: any[] = [];
  statusList: any[] = []; 

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const permissao = localStorage.getItem('permissao');
    this.permissaoLogada = permissao || '';

    if (!token) {
      this.erro = 'Token de autenticação não encontrado. Faça login novamente.';
      return;
    }

    this.carregarStatus(token).subscribe(() => {
      this.carregarTecnicos(token).subscribe(() => {
        this.carregarOrdens(token);
      });
    });
  }

  carregarStatus(token: string): any { 
    return this.dataService.listarStatus(token).pipe(
      tap(response => {
        this.statusList = response.status || [];
        if (this.statusList.length > 0) {
          this.novaOrdem.id_status = this.statusList[0].id;
        }
      }),
      catchError(err => {
        console.error('Erro ao carregar status:', err);
        return throwError(() => new Error('Erro ao carregar status.')); 
      })
    );
  }

  carregarTecnicos(token: string): any { 
    return this.dataService.listarTecnicos(token).pipe(
      tap(response => {
        this.tecnicos = response.tecnicos || [];
      }),
      catchError(err => {
        console.error('Erro ao carregar técnicos:', err);
        return throwError(() => new Error('Erro ao carregar técnicos.'));
      })
    );
  }

  carregarOrdens(token: string): void {
    this.dataService.listarOrdens(token).subscribe({
      next: (response) => {
        this.ordens = (response.ordens_servico || []).map((ordem: any) => {
          const statusEncontrado = this.statusList.find(s => s.id === ordem.id_status);
          const tecnicoEncontrado = this.tecnicos.find(t => t.id === ordem.id_tecnico);

          return {
            ...ordem,
            data_abertura: new Date(ordem.data_abertura),
            prazo_desktop: ordem.prazo_desktop ? new Date(ordem.prazo_desktop) : null,
            prazo_tecnico: ordem.prazo_tecnico ? new Date(ordem.prazo_tecnico) : null,
            id_status: ordem.id_status, 
            descricao_status: statusEncontrado ? statusEncontrado.descricao : 'Desconhecido',
            nome_tecnico: tecnicoEncontrado ? tecnicoEncontrado.nome : 'Não Atribuído'
          };
        });
        this.filterAndSortOrdens();
      },
      error: (err) => {
        this.erro = 'Erro ao carregar ordens de serviço. Verifique a autenticação.';
        console.error(err);
      }
    });
  }

  filterAndSortOrdens(): void {
    let filtered = this.ordens;

    if (this.searchTerm) {
      const termo = this.searchTerm.toLowerCase();
      filtered = filtered.filter(ordem =>
        (ordem.wo_projeto?.toLowerCase().includes(termo) ?? false) ||
        (ordem.cidade?.toLowerCase().includes(termo) ?? false) ||
        (ordem.regional?.toLowerCase().includes(termo) ?? false) ||
        (ordem.escopo?.toLowerCase().includes(termo) ?? false) ||
        (ordem.premissas?.toLowerCase().includes(termo) ?? false) ||
        (ordem.nome_tecnico?.toLowerCase().includes(termo) ?? false) ||
        (ordem.descricao_status?.toLowerCase().includes(termo) ?? false)
      );
    }

    this.filteredOrdens = filtered;
  }

  abrirModalEditar(ordem: any): void {
    if (this.permissaoLogada === 'admin' || this.permissaoLogada === 'dev') {
      this.ordemSelecionada = { ...ordem };
      this.ordemSelecionada.data_abertura = new Date(ordem.data_abertura);
      this.ordemSelecionada.prazo_desktop = ordem.prazo_desktop ? new Date(ordem.prazo_desktop) : null;
      this.ordemSelecionada.prazo_tecnico = ordem.prazo_tecnico ? new Date(ordem.prazo_tecnico) : null;
      this.ordemSelecionada.id_status = ordem.id_status;
      this.mostrarModalEditar = true;
    }
  }

  fecharModalEditar(): void {
    this.mostrarModalEditar = false;
    this.ordemSelecionada = null;
  }

  salvarAlteracoes(): void {
    const token = localStorage.getItem('token');
    if (!token || !this.ordemSelecionada || this.ordemSelecionada.id === undefined) {
      alert('Erro: Não foi possível salvar as alterações. Ordem ou token ausente.');
      return;
    }

    const dataAberturaFormatada = formatDate(this.ordemSelecionada.data_abertura, 'yyyy-MM-dd', 'en-US');
    const prazoDesktopFormatado = this.ordemSelecionada.prazo_desktop ? formatDate(this.ordemSelecionada.prazo_desktop, 'yyyy-MM-dd', 'en-US') : null;
    const prazoTecnicoFormatado = this.ordemSelecionada.prazo_tecnico ? formatDate(this.ordemSelecionada.prazo_tecnico, 'yyyy-MM-dd', 'en-US') : null;

    const ordemParaEnviar = {
      ...this.ordemSelecionada,
      data_abertura: dataAberturaFormatada,
      prazo_desktop: prazoDesktopFormatado,
      prazo_tecnico: prazoTecnicoFormatado,
      id_status: this.ordemSelecionada.id_status
    };

    this.dataService.atualizarOrdem(this.ordemSelecionada.id, ordemParaEnviar, token).subscribe({
      next: () => {
        alert('Ordem de serviço atualizada com sucesso!');
        this.fecharModalEditar();
        this.carregarOrdens(token);
      },
      error: (err) => {
        console.error('Erro ao atualizar ordem de serviço:', err);
        alert('Erro ao atualizar ordem de serviço. Detalhes: ' + (err.error?.error || err.message));
      }
    });
  }

  confirmarDelecao(id: number, event: Event): void {
    event.stopPropagation();
    if (this.permissaoLogada !== 'admin' && this.permissaoLogada !== 'dev') {
      alert('Você não tem permissão para deletar ordens de serviço.');
      return;
    }

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
      prazo_desktop: new Date(),
      prazo_tecnico: new Date(),
      id_status: this.statusList.length > 0 ? this.statusList[0].id : null, 
      id_tecnico: null
    };
    this.mostrarModalCriar = true;
  }

  fecharModalCriar(): void {
    this.mostrarModalCriar = false;
  }

  salvarNovaOrdem(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Erro: Token de autenticação não encontrado.');
      return;
    }

    const dataAberturaFormatada = this.novaOrdem.data_abertura
      ? formatDate(this.novaOrdem.data_abertura, 'yyyy-MM-dd', 'en-US')
      : null;

    const prazoDesktopFormatado = this.novaOrdem.prazo_desktop
      ? formatDate(this.novaOrdem.prazo_desktop, 'yyyy-MM-dd', 'en-US')
      : null;

    const prazoTecnicoFormatado = this.novaOrdem.prazo_tecnico
      ? formatDate(this.novaOrdem.prazo_tecnico, 'yyyy-MM-dd', 'en-US')
      : null;

    const novaOrdemParaEnviar = {
      ...this.novaOrdem,
      data_abertura: dataAberturaFormatada,
      prazo_desktop: prazoDesktopFormatado,
      prazo_tecnico: prazoTecnicoFormatado,
      id_status: this.novaOrdem.id_status
    };

    this.dataService.criarOrdem(novaOrdemParaEnviar, token).subscribe({
      next: () => {
        alert('Ordem de serviço criada com sucesso!');
        this.mostrarModalCriar = false;
        this.carregarOrdens(token);
      },
      error: (err) => {
        console.error('Erro ao criar ordem de serviço:', err);
        alert('Erro ao criar ordem de serviço. Detalhes: ' + (err.error?.error || err.message));
      }
    });
  }

  subtrairDias(data: Date, dias: number): Date {
    const novaData = new Date(data);
    novaData.setDate(novaData.getDate() - dias);
    return novaData;
  }

  onPrazoDesktopChange(novoPrazo: Date, isCriarModal: boolean): void {
    const prazoBase = new Date(novoPrazo);
    const novoPrazoTecnico = this.subtrairDias(prazoBase, 5);

    if (isCriarModal) {
      this.novaOrdem.prazo_desktop = prazoBase;
      this.novaOrdem.prazo_tecnico = novoPrazoTecnico;
    } else {
      if (this.ordemSelecionada) {
        this.ordemSelecionada.prazo_desktop = prazoBase;
        this.ordemSelecionada.prazo_tecnico = novoPrazoTecnico;
      }
    }
  }

  isPrazoCritico(prazo: string | Date): boolean {
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    hoje.setHours(0, 0, 0, 0);
    dataPrazo.setHours(0, 0, 0, 0);

    const diffTime = dataPrazo.getTime() - hoje.getTime();
    const diffDias = diffTime / (1000 * 60 * 60 * 24);
    return diffDias < 5;
  }

calcularDiasRestantes(prazo: string | Date, statusId: number): number | string {
  if (statusId === 2) {
    return 0;
  }

  const hoje = new Date();
  const dataPrazo = new Date(prazo);
  hoje.setHours(0, 0, 0, 0);
  dataPrazo.setHours(0, 0, 0, 0);

  const diffTime = dataPrazo.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDias;
}

  atualizarPrazoTecnico() {
    if (this.novaOrdem.prazo_desktop) {
      const prazo = new Date(this.novaOrdem.prazo_desktop);
      const prazoTecnico = new Date(prazo);
      prazoTecnico.setDate(prazo.getDate() - 5);
      this.novaOrdem.prazo_tecnico = prazoTecnico;
    }
  }
}