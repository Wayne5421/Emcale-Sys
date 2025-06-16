import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  nome = localStorage.getItem('nome_completo') || '';
  permissao = localStorage.getItem('permissao') || '';

  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
