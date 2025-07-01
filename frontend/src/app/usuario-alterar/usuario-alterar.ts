import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario } from '../services/usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-alterar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-alterar.html',
  styleUrls: ['./usuario-alterar.css']
})
export class UsuarioAlterarComponent implements OnInit {

  usuariosList: Usuario[] = [];
  usuarioSelecionado: Usuario | null = null;
  errorMessage: string = '';

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('alterarUsuarioForm')
  private alterarUsuarioForm!: NgForm;

  constructor(private usuarioService: UsuarioService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => {
        this.usuariosList = data;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao carregar usuários', err);
        this.errorMessage = 'Erro ao carregar usuários. Tente novamente.';
        this.modalService.open(this.errorModal, { centered: true });
      }
    });
  }

  selecionarUsuarioParaAlterar(usuario: Usuario): void {
    // Cria uma cópia do usuário para evitar modificações diretas na lista
    this.usuarioSelecionado = { ...usuario, senha: '' }; // Limpa a senha para não pré-preencher
    this.errorMessage = ''; // Limpa mensagens de erro anteriores
  }

  salvarAlteracoes(): void {
    if (this.usuarioSelecionado && this.usuarioSelecionado.id) {
      this.usuarioService.updateUsuario(this.usuarioSelecionado.id, this.usuarioSelecionado).subscribe({
        next: (res) => {
          console.log('Usuário atualizado com sucesso', res);
          this.modalService.open(this.successModal, { centered: true }).result.then(() => {
            setTimeout(() => {
              this.carregarUsuarios(); // Recarrega a lista de usuários
              this.resetForm(); // Limpa o formulário de alteração
            }, 0); // Pequeno atraso para permitir que o DOM se atualize
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao salvar alterações', err);
          if (err.status === 409 && err.error && err.error.message) {
            this.errorMessage = err.error.message; // Mensagem específica do backend
          } else {
            this.errorMessage = 'Erro ao salvar alterações. Tente novamente.';
          }
          this.modalService.open(this.errorModal, { centered: true });
        }
      });
    }
  }

  resetForm(): void {
    if (this.alterarUsuarioForm) {
      this.alterarUsuarioForm.resetForm(); // Resetar o estado interno do formulário primeiro
    }
    this.usuarioSelecionado = null; // Depois, definir a propriedade do componente como null
    this.errorMessage = '';
  }
}
