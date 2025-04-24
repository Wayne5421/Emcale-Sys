import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  nome = '';
  permissao = '';

  ngOnInit() {
    console.log(localStorage);

    this.nome = localStorage.getItem('nome_completo') || '';
    this.permissao = localStorage.getItem('permissao') || '';
  }

}
