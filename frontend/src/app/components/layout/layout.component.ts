import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
