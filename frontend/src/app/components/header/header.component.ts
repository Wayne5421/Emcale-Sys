import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  isDarkMode = true;
  nome = localStorage.getItem('nome_completo') || '';
  permissao = localStorage.getItem('permissao') || '';
  searchMode = false;

  @ViewChild('searchInput') searchInput!: ElementRef;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
  }

  toggleSearch() {
    this.searchMode = !this.searchMode;
    if (this.searchMode) {
      setTimeout(() => {
        this.searchInput?.nativeElement?.focus();
      }, 300);
    }
  }

  closeSearch() {
    this.searchMode = false;
    if (this.searchInput) {
      this.searchInput.nativeElement.value = '';
    }
  }

  performSearch(query: string) {
    if (query.trim()) {
      console.log('Pesquisando por:', query);
      // falta fazer a logicawwwww
      this.closeSearch();
    }
  }

  onSearchInput(event: any) {
    const query = event.target.value;
    if (query.length > 2) {
      // falta fazer a logicawwwwww
      console.log('Buscando em tempo real:', query);
    }
  }

  ngOnInit(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkMode = savedTheme === 'dark';
      document.body.classList.toggle('dark-theme', this.isDarkMode);
    }

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.searchMode) {
        this.closeSearch();
      }
    });
  }
}
