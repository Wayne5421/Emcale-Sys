import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent {

  nome = localStorage.getItem('nome_completo') || '';
  permissao = localStorage.getItem('permissao') || '';

  searchMode = false;
  @ViewChild('searchInput') searchInput!: ElementRef;


  constructor(public theme: ThemeService, private cdRef: ChangeDetectorRef) {}


  get isDarkMode(): boolean {
    return this.theme.isDark();
  }

  toggleTheme(): void {
    this.theme.toggle();
  }

  toggleSearch(): void {
    this.searchMode = !this.searchMode;
    if (this.searchMode) {
      setTimeout(() => this.searchInput?.nativeElement?.focus(), 300);
    }
  }

  closeSearch(): void {
    this.searchMode = false;
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  performSearch(query: string): void {
    if (query.trim()) {
      console.log('Pesquisando por:', query);
      // TODO lógica real
      this.closeSearch();
    }
  }

  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.value.length > 2) {
      // TODO busca em tempo real
      console.log('Buscando em tempo real:', target.value);
    }
  }

  // captura Esc global para fechar busca
ngOnInit(): void {
  // já existente
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && this.searchMode) this.closeSearch();
  });

  // novo: escuta mudança de tema
  window.addEventListener('theme-changed', () => {
    this.cdRef.detectChanges(); // força atualização do Angular
  });
}
}