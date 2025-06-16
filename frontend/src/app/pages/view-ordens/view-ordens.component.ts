import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap, catchError } from 'rxjs/operators';
import { throwError, forkJoin } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-view-ordens',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './view-ordens.component.html',
  styleUrl: './view-ordens.component.css',
  providers: [DatePipe]
})
export class ViewOrdens implements OnInit {
  displayedColumns: string[] = [
    'id',
    'wo_projeto',
    'cidade',
    'regional',
    'escopo',
    'premissas',
    'data_abertura',
    'prazo_desktop',
    'prazo_tecnico',
    'descricao_status',
    'nome_tecnico',
    'dias_restantes'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;

  statusList: any[] = [];
  tecnicos: any[] = [];

  constructor(private dataService: DataService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token de autenticação não encontrado.');
      return;
    }

    forkJoin([
      this.carregarStatus(token),
      this.carregarTecnicos(token)
    ]).subscribe({
      next: () => {
        this.carregarOrdens(token);
      },
      error: (err) => {
        console.error('Erro ao carregar dados iniciais para a tabela:', err);
      }
    });
  }

  carregarStatus(token: string) {
    return this.dataService.listarStatus(token).pipe(
      tap(response => {
        this.statusList = response.status || [];
      }),
      catchError(err => {
        console.error('Erro ao carregar status:', err);
        return throwError(() => new Error('Erro ao carregar status.'));
      })
    );
  }

  carregarTecnicos(token: string) {
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
      const ordens = (response.ordens_servico || []).map((ordem: any) => {
        const statusEncontrado = this.statusList.find(s => s.id === ordem.id_status);
        const tecnicoEncontrado = this.tecnicos.find(t => t.id === ordem.id_tecnico);

        return {
          ...ordem,
          data_abertura: new Date(ordem.data_abertura),
          prazo_desktop: ordem.prazo_desktop ? new Date(ordem.prazo_desktop) : null,
          prazo_tecnico: ordem.prazo_tecnico ? new Date(ordem.prazo_tecnico) : null,
          descricao_status: statusEncontrado ? statusEncontrado.descricao : 'Desconhecido',
          nome_tecnico: tecnicoEncontrado ? tecnicoEncontrado.nome : 'Não Atribuído',
          dias_restantes: ordem.prazo_desktop ? this.calcularDiasRestantes(ordem.prazo_desktop, ordem.id_status) : 'N/A'
        };
      });

      const ordensOrdenadas = ordens.sort((a: any, b: any) => {
        const statusA = a.descricao_status.toLowerCase();
        const statusB = b.descricao_status.toLowerCase();

        if (statusA === 'fechada' && statusB !== 'fechada') {
          return 1; 
        }
        if (statusA !== 'fechada' && statusB === 'fechada') {
          return -1; 
        }
        return 0; 
      });

      this.dataSource.data = ordensOrdenadas;
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    },
    error: (err) => {
      console.error('Erro ao carregar ordens de serviço:', err);
    }
  });
}

  calcularDiasRestantes(prazo: string | Date, statusId: number): number | string {
    if (statusId === 2) {
      return 0;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const dataPrazo = new Date(prazo);
    dataPrazo.setHours(0, 0, 0, 0);

    const diffTime = dataPrazo.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getRowClass(ordem: any): string {
    if (ordem.id_status === 2) {
      return '';
    }

    if (!ordem.prazo_desktop || typeof ordem.dias_restantes !== 'number') {
      return '';
    }

    const diasFaltando = ordem.dias_restantes;

    if (diasFaltando < 0) {
      return 'prazo-vencido'; 
    } else if (diasFaltando <= 5) {
      return 'prazo-atencao'; 
    }
    return ''; 
  }

    getStatusCellClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'fechada':
        return 'status-fechada';
      case 'cancelado':
        return 'status-cancelado';
      case 'aguardando':
        return 'status-aguardando';
      case 'em andamento':
        return 'status-em-andamento';
      case 'aberta': 
        return 'status-em-aberta';
      
      default:
        return ''; 
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}