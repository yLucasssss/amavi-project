import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-redefinir-senha',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './redefinir-senha.component.html',
  styleUrls: ['./redefinir-senha.component.css']
})
export class RedefinirSenhaComponent implements OnInit {

  senha = '';
  confirmarSenha = '';
  token = '';
  mensagem = '';
  erro = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.token = this.route.snapshot.params['token'];
  }

  onSubmit() {
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem.';
      return;
    }

    this.authService.redefinirSenha(this.token, this.senha).subscribe({
      next: () => {
        this.mensagem = 'Senha redefinida com sucesso!';
        this.erro = '';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.erro = 'Ocorreu um erro ao tentar redefinir a senha.';
        this.mensagem = '';
      }
    });
  }
}
