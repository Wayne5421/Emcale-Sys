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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    MatFormFieldModule,
  ],
  templateUrl: "./view-ordens.component.html",
  providers: [DatePipe],
})
export class ViewOrdens implements OnInit {
  displayedColumns: string[] = [
    "select",
    "id",
    "wo_projeto",
    "cidade",
    "regional",
    "escopo",
    "premissas",
    "data_abertura",
    "prazo_desktop",
    "prazo_tecnico",
    "descricao_status",
    "nome_tecnico",
    "dias_restantes",
    "data_entrega"
  ]

  dataSource = new MatTableDataSource<any>([])
  filteredOrdens: any[] = []
  selectedOrdens: any[] = []
  searchTerm = ""
  selectedStatus = ""
  selectedTecnico = ""

  mostrarModalObservacao: boolean = false;
  ordemSelecionada: any = null;
  ordemMateriais: any = null;

  currentPage = 1
  itemsPerPage = 25

  irParaPaginaAnterior(): void {
  if (this.currentPage > 1) {
    this.currentPage--
  }
}

irParaProximaPagina(): void {
  if (this.currentPage < this.totalPages) {
    this.currentPage++
  }
}


  @ViewChild(MatSort) sort!: MatSort

  statusList: any[] = []
  tecnicos: any[] = []

  sortColumn = ""
  sortDirection: "asc" | "desc" | "" = ""

  constructor(
    private dataService: DataService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem("token")
    if (!token) {
      console.error("Token de autenticação não encontrado.")
      return
    }

    forkJoin([this.carregarStatus(token), this.carregarTecnicos(token)]).subscribe({
      next: () => {
        this.carregarOrdens(token)
      },
      error: (err) => {
        console.error("Erro ao carregar dados iniciais para a tabela:", err)
      },
    })
  }


exportarParaExcel(): void {
  const dadosParaExportar = this.filteredOrdens.map(ordem => ({
    Projeto: ordem.wo_projeto,
    Cidade: ordem.cidade,
    Regional: ordem.regional,
    Escopo: ordem.escopo,
    Premissas: ordem.premissas || '-',
    Abertura: this.datePipe.transform(ordem.data_abertura, 'dd/MM/yyyy'),
    'Prazo Desktop': ordem.prazo_desktop ? this.datePipe.transform(ordem.prazo_desktop, 'dd/MM/yyyy') : '-',
    'Prazo Técnico': ordem.prazo_tecnico ? this.datePipe.transform(ordem.prazo_tecnico, 'dd/MM/yyyy') : '-',
    Status: ordem.descricao_status,
    Técnico: ordem.nome_tecnico,
    'Dias Restantes': ordem.dias_restantes,
    'Data Entrega': ordem.data_entrega ? this.datePipe.transform(ordem.data_entrega, 'dd/MM/yyyy') : '-',
  }));

  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosParaExportar);
  const wb: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Ordens');

  const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, 'ordens-servico.xlsx');
}



exportarParaPDF(): void {
  const doc = new jsPDF();

  const dadosParaExportar = this.filteredOrdens.map(ordem => [
    ordem.wo_projeto,
    ordem.cidade,
    ordem.regional,
    ordem.escopo,
    ordem.premissas || '-',
    this.datePipe.transform(ordem.data_abertura, 'dd/MM/yyyy'),
    ordem.prazo_desktop ? this.datePipe.transform(ordem.prazo_desktop, 'dd/MM/yyyy') : '-',
    ordem.prazo_tecnico ? this.datePipe.transform(ordem.prazo_tecnico, 'dd/MM/yyyy') : '-',
    ordem.descricao_status,
    ordem.nome_tecnico,
    typeof ordem.dias_restantes === 'number' ? ordem.dias_restantes + 'd' : ordem.dias_restantes,
    ordem.data_entrega ? this.datePipe.transform(ordem.data_entrega, 'dd/MM/yyyy') : '-',
  ]);

  autoTable(doc, {
    head: [[
      'Projeto', 'Cidade', 'Regional', 'Escopo', 'Premissas', 'Abertura',
      'Prazo Desktop', 'Prazo Técnico', 'Status', 'Técnico', 'Restam', 'Entrega'
    ]],
    body: dadosParaExportar,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [55, 65, 81], // cinza escuro
      textColor: [255, 255, 255],
    },
  });

  doc.save('ordens-servico.pdf');
}




  carregarStatus(token: string) {
    return this.dataService.listarStatus(token).pipe(
      tap((response) => {
        this.statusList = response.status || []
      }),
      catchError((err) => {
        console.error("Erro ao carregar status:", err)
        return throwError(() => new Error("Erro ao carregar status."))
      }),
    )
  }

  carregarTecnicos(token: string) {
    return this.dataService.listarTecnicos(token).pipe(
      tap((response) => {
        this.tecnicos = response.tecnicos || []
      }),
      catchError((err) => {
        console.error("Erro ao carregar técnicos:", err)
        return throwError(() => new Error("Erro ao carregar técnicos."))
      }),
    )
  }


  get totalPages(): number {
    return Math.ceil(this.filteredOrdens.length / this.itemsPerPage)
  }

  get paginatedOrdens(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage
    return this.filteredOrdens.slice(start, start + this.itemsPerPage)
  }


salvarDataEntrega(ordem: any): void {
  const token = localStorage.getItem("token");
  if (!token) return;

  const dataEntregaStr = ordem.novaDataEntrega;
  if (!dataEntregaStr) return;

  const dataEntregaCorrigida = new Date(`${dataEntregaStr}T12:00:00`);

  const statusFechada = this.statusList.find(status => status.descricao.toLowerCase() === 'fechada');
  const idStatusFechada = statusFechada ? statusFechada.id : ordem.id_status;

  const payload = {
    data_entrega: this.datePipe.transform(dataEntregaCorrigida, 'yyyy-MM-dd'),
    prazo_desktop: ordem.prazo_desktop
      ? this.datePipe.transform(ordem.prazo_desktop, 'yyyy-MM-dd')
      : null,
    prazo_tecnico: ordem.prazo_tecnico
      ? this.datePipe.transform(ordem.prazo_tecnico, 'yyyy-MM-dd')
      : null,
    id_tecnico: ordem.id_tecnico,
    id_status: idStatusFechada,  
  };

  this.dataService.atualizarOrdem(ordem.id, payload, token).subscribe({
    next: () => {
      ordem.data_entrega = dataEntregaCorrigida;
      ordem.modoEdicaoDataEntrega = false;
      ordem.novaDataEntrega = null;

      if (statusFechada) {
        ordem.descricao_status = statusFechada.descricao;
        ordem.id_status = statusFechada.id;
      }
    },
    error: (err) => {
      console.error("Erro ao salvar data de entrega:", err);
    }
  });
}



cancelarEdicaoDataEntrega(ordem: any): void {
  ordem.modoEdicaoDataEntrega = false;
  ordem.novaDataEntrega = null;
}



  carregarOrdens(token: string): void {
    this.dataService.listarOrdens(token).subscribe({
      next: (response) => {
        const ordens = (response.ordens_servico || []).map((ordem: any) => {
          const statusEncontrado = this.statusList.find((s) => s.id === ordem.id_status)
          const tecnicoEncontrado = this.tecnicos.find((t) => t.id === ordem.id_tecnico)

          return {
            ...ordem,
            data_abertura: new Date(ordem.data_abertura),
            prazo_desktop: ordem.prazo_desktop ? new Date(ordem.prazo_desktop) : null,
            prazo_tecnico: ordem.prazo_tecnico ? new Date(ordem.prazo_tecnico) : null,
            descricao_status: statusEncontrado ? statusEncontrado.descricao : "Desconhecido",
            nome_tecnico: tecnicoEncontrado ? tecnicoEncontrado.nome : "Não Atribuído",
            dias_restantes: ordem.prazo_desktop
              ? this.calcularDiasRestantes(ordem.prazo_desktop, ordem.id_status)
              : "N/A",

            data_entrega: ordem.data_entrega ? new Date(ordem.data_entrega) : null,
            modoEdicaoDataEntrega: false,
            novaDataEntrega: null,
          }
        })

        const ordensOrdenadas = ordens.sort((a: any, b: any) => {
          const statusA = a.descricao_status.toLowerCase()
          const statusB = b.descricao_status.toLowerCase()

          if (statusA === "fechada" && statusB !== "fechada") {
            return 1
          }
          if (statusA !== "fechada" && statusB === "fechada") {
            return -1
          }
          return 0
        })

        this.dataSource.data = ordensOrdenadas
        this.filteredOrdens = ordensOrdenadas
        if (this.sort) {
          this.dataSource.sort = this.sort
        }
      },
      error: (err) => {
        console.error("Erro ao carregar ordens de serviço:", err)
      },
    })
  }

  calcularDiasRestantes(prazo: string | Date, statusId: number): number | string {
    if (statusId === 2) {
      return 0
    }

    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)

    const dataPrazo = new Date(prazo)
    dataPrazo.setHours(0, 0, 0, 0)

    const diffTime = dataPrazo.getTime() - hoje.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  getRowClass(ordem: any): string {
    let classes = ""

    if (this.isSelected(ordem)) {
      classes += "bg-yellow-500/10 border-l-4 border-yellow-500 "
    }

    if (ordem.id_status === 2) {
      return classes
    }

    if (!ordem.prazo_desktop || typeof ordem.dias_restantes !== "number") {
      return classes
    }

    const diasFaltando = ordem.dias_restantes

    if (diasFaltando < 0) {
      classes += "bg-red-500/5 "
    } else if (diasFaltando <= 5) {
      classes += "bg-yellow-500/5 "
    }

    return classes
  }

  onSearchChange(): void {
    this.applyFilter()
    this.currentPage = 1
  }

  applyFilter(): void {
    let filtered = this.dataSource.data

    if (this.searchTerm && this.searchTerm.trim() !== "") {
      const searchLower = this.searchTerm.toLowerCase().trim()
      filtered = filtered.filter((ordem) => {
        return (
          (ordem.wo_projeto && ordem.wo_projeto.toLowerCase().includes(searchLower)) ||
          (ordem.cidade && ordem.cidade.toLowerCase().includes(searchLower)) ||
          (ordem.regional && ordem.regional.toLowerCase().includes(searchLower)) ||
          (ordem.escopo && ordem.escopo.toLowerCase().includes(searchLower)) ||
          (ordem.premissas && ordem.premissas.toLowerCase().includes(searchLower)) ||
          (ordem.nome_tecnico && ordem.nome_tecnico.toLowerCase().includes(searchLower)) ||
          (ordem.descricao_status && ordem.descricao_status.toLowerCase().includes(searchLower)) ||
          (ordem.id && ordem.id.toString().includes(searchLower))
        )
      })
    }

    if (this.selectedStatus && this.selectedStatus.trim() !== "") {
      filtered = filtered.filter((ordem) => ordem.descricao_status.toLowerCase() === this.selectedStatus.toLowerCase())
    }

    if (this.selectedTecnico && this.selectedTecnico.trim() !== "") {
      filtered = filtered.filter((ordem) => ordem.nome_tecnico.toLowerCase() === this.selectedTecnico.toLowerCase())
    }

    this.filteredOrdens = filtered
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case "fechada":
        return "green"
      case "cancelado":
        return "red"
      case "aguardando":
        return "yellow"
      case "em andamento":
        return "blue"
      case "aberta":
        return "orange"
      default:
        return "gray"
    }
  }

  getDiasRestantesColor(dias: any): string {
    if (typeof dias !== "number") return "gray"
    if (dias < 0) return "red"
    if (dias <= 5) return "yellow"
    return "green"
  }

  trackByFn(index: number, item: any): any {
    return item.id
  }

  getOrdensCount(status: string): number {
    return this.dataSource.data.filter((ordem) => ordem.descricao_status.toLowerCase() === status.toLowerCase()).length
  }

  getVencidasCount(): number {
    return this.dataSource.data.filter((ordem) => typeof ordem.dias_restantes === "number" && ordem.dias_restantes < 0)
      .length
  }

  isSelected(ordem: any): boolean {
    return this.selectedOrdens.some((selected) => selected.id === ordem.id)
  }

  toggleSelection(ordem: any): void {
    const index = this.selectedOrdens.findIndex((selected) => selected.id === ordem.id)
    if (index > -1) {
      this.selectedOrdens.splice(index, 1)
    } else {
      this.selectedOrdens.push(ordem)
    }
  }

  isAllSelected(): boolean {
    return this.filteredOrdens.length > 0 && this.selectedOrdens.length === this.filteredOrdens.length
  }

  isIndeterminate(): boolean {
    return this.selectedOrdens.length > 0 && this.selectedOrdens.length < this.filteredOrdens.length
  }

  toggleAllSelection(): void {
    if (this.isAllSelected()) {
      this.selectedOrdens = []
    } else {
      this.selectedOrdens = [...this.filteredOrdens]
    }
  }

  clearSelection(): void {
    this.selectedOrdens = []
  }

  atribuirTecnico(): void {
    console.log("Atribuindo técnico para:", this.selectedOrdens)
  }

  alterarStatus(): void {
    console.log("Alterando status para:", this.selectedOrdens)
  }

  getStatusCellClass(status: string): string {
    switch (status.toLowerCase()) {
      case "fechada":
        return "status-fechada"
      case "cancelado":
        return "status-cancelado"
      case "aguardando":
        return "status-aguardando"
      case "em andamento":
        return "status-em-andamento"
      case "aberta":
        return "status-aberta"
      default:
        return "status-default"
    }
  }

  sortData(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === "asc" ? "desc" : this.sortDirection === "desc" ? "" : "asc"
    } else {
      this.sortColumn = column
      this.sortDirection = "asc"
    }

    if (this.sortDirection === "") {
      this.sortColumn = ""
      this.applyFilter()
      return
    }

    this.filteredOrdens.sort((a, b) => {
      let aValue = a[column]
      let bValue = b[column]

      if (column.includes("data") || column.includes("prazo")) {
        aValue = aValue ? new Date(aValue).getTime() : 0
        bValue = bValue ? new Date(bValue).getTime() : 0
      }

      if (column === "id" || column === "dias_restantes") {
        aValue = typeof aValue === "number" ? aValue : 0
        bValue = typeof bValue === "number" ? bValue : 0
      }

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {
        return this.sortDirection === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return this.sortDirection === "asc" ? 1 : -1
      }
      return 0
    })
  }


abrirModalObservacao(ordem: any) {
  this.ordemSelecionada = ordem;
}

abrirModalMateriais(ordem: any) {
  this.ordemMateriais = ordem;
}

fecharModalObservacao() {
  this.ordemSelecionada = null;
}

fecharModalMateriais() {
  this.ordemMateriais = null;
}

  getSortIcon(column: string): string {
    if (this.sortColumn !== column) return ""
    return this.sortDirection === "asc" ? "↑" : this.sortDirection === "desc" ? "↓" : ""
  }
}
