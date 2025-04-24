import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  usuario = '';
  senha = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    this.authService.login(this.usuario, this.senha).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // Salva o token
        localStorage.setItem('nome_completo', res.nome_completo); // Nome do usuário
        localStorage.setItem('permissao', res.permissao); // Permissão
        this.router.navigate(['/home']); // Vai pra tela inicial
      },
      error: (err) => {
        this.erro = err.error?.error || 'Erro ao fazer login';
      }
    });
  }
}
