import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsuarioService, Usuario } from '../services/usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-usuario-excluir',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './usuario-excluir.html',
  styleUrls: ['./usuario-excluir.css']
})
export class UsuarioExcluirComponent implements OnInit {

  usuariosList: Usuario[] = [];
  errorMessage: string = '';
  usuarioParaExcluirId: number | null = null;

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('confirmacaoExclusaoModal')
  private confirmacaoExclusaoModal!: TemplateRef<any>;

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

  confirmarExclusao(id: number | undefined): void {
    if (id) {
      this.usuarioParaExcluirId = id;
      this.modalService.open(this.confirmacaoExclusaoModal, { centered: true });
    }
  }

  procederExclusao(): void {
    if (this.usuarioParaExcluirId) {
      this.usuarioService.deleteUsuario(this.usuarioParaExcluirId).subscribe({
        next: (res) => {
          console.log('Usuário excluído com sucesso', res);
          this.modalService.open(this.successModal, { centered: true }).result.then(() => {
            this.carregarUsuarios(); // Recarrega a lista de usuários
            this.usuarioParaExcluirId = null;
          });
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir usuário', err);
          this.errorMessage = 'Erro ao excluir usuário. Tente novamente.';
          this.modalService.open(this.errorModal, { centered: true });
        }
      });
    }
    this.modalService.dismissAll(); // Fecha o modal de confirmação
  }

  cancelarExclusao(): void {
    this.usuarioParaExcluirId = null;
    this.modalService.dismissAll();
  }
}