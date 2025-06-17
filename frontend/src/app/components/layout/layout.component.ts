import { Component } from '@angular/core';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './layout.component.html'
})
export class LayoutComponent {
  isDarkMode = false;
  nome = localStorage.getItem('nome_completo') || '';
  permissao = localStorage.getItem('permissao') || '';

  constructor(private router: Router) {
    this.isDarkMode = localStorage.getItem('theme') === 'dark';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isDarkMode = localStorage.getItem('theme') === 'dark';      }
    });
  }

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
