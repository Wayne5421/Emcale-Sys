import { Component, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';

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
    MatInputModule
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
    'prazo',
    'dias_restantes',
    'nome_tecnico'
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.dataService.listarOrdens(token).subscribe({
        next: (response) => {
          const ordens = (response.ordens_servico || []).map((ordem: { prazo: string | Date }) => ({
            ...ordem,
            dias_restantes: this.calcularDiasRestantes(ordem.prazo)
          }));
          this.dataSource.data = ordens;
          this.dataSource.sort = this.sort;
        },
        error: (err) => {
          console.error('Erro ao carregar ordens de serviço:', err);
        }
      });
    }
  }

  calcularDiasRestantes(prazo: string | Date): number {
    const hoje = new Date();
    const dataPrazo = new Date(prazo);
    const diffTime = dataPrazo.getTime() - hoje.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
