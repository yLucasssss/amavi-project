import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UsuarioService, Usuario } from '../services/usuario';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-cadastro.html',
  styleUrls: ['./usuario-cadastro.css']
})
export class UsuarioCadastroComponent {

  usuario: Usuario = { nome: '', email: '', senha: '' };
  errorMessage: string = '';

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('usuarioForm')
  private usuarioForm!: NgForm;

  constructor(private usuarioService: UsuarioService, private modalService: NgbModal, private router: Router) { }

  cadastrarUsuario() {
    console.log('Dados do usuário antes de enviar:', this.usuario); // Adicionado para depuração
    this.usuarioService.createUsuario(this.usuario).subscribe({
      next: (res) => {
        console.log('Usuário cadastrado com sucesso', res);
        this.modalService.open(this.successModal, { centered: true }).result.then(() => {
          this.resetForm(); // Resetar o formulário após o redirecionamento
          this.router.navigate(['/login']); // Redireciona após fechar o modal de sucesso
        });
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao cadastrar usuário', err);
        if (err.status === 409 && err.error && err.error.message) {
          this.errorMessage = err.error.message; // Mensagem específica do backend
        } else {
          this.errorMessage = 'Erro ao cadastrar usuário. Tente novamente.';
        }
        this.modalService.open(this.errorModal, { centered: true });
      }
    });
  }

  resetForm() {
    this.usuario = { nome: '', email: '', senha: '' };
    if (this.usuarioForm) {
      this.usuarioForm.resetForm();
    }
  }
}
