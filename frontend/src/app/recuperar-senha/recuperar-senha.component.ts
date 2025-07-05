import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-senha',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.css']
})
export class RecuperarSenhaComponent {

  email = '';
  mensagem = '';
  erro = '';

  constructor(private authService: AuthService, private router: Router) { }

  onSubmit() {
    this.authService.recuperarSenha(this.email).subscribe({
      next: () => {
        this.mensagem = 'Um e-mail de recuperação foi enviado para o seu endereço.';
        this.erro = '';
      },
      error: (err) => {
        this.erro = 'Ocorreu um erro ao tentar enviar o e-mail de recuperação.';
        this.mensagem = '';
      }
    });
  }
}
