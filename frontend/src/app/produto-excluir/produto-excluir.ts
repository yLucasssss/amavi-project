import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService, Produto } from '../services/produto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-produto-excluir',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produto-excluir.html',
  styleUrls: ['./produto-excluir.css']
})
export class ProdutoExcluirComponent {

  searchCode: string = '';
  produto: Produto | null = null;
  produtoEncontrado: boolean = false;
  errorMessage: string = '';

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('searchForm')
  private searchForm!: NgForm;
  @ViewChild('confirmacaoExclusaoModal')
  private confirmacaoExclusaoModal!: TemplateRef<any>;

  constructor(private produtoService: ProdutoService, private modalService: NgbModal) { }

  buscarProduto() {
    if (this.searchCode) {
      this.produtoService.getProdutoByCodigo(this.searchCode).subscribe({
        next: (data) => {
          this.produto = data;
          this.produtoEncontrado = true;
          this.errorMessage = '';
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao buscar produto', err);
          this.produtoEncontrado = false;
          this.produto = null;
          this.errorMessage = 'Produto não encontrado. Verifique o código e tente novamente.';
          this.modalService.open(this.errorModal, { centered: true });
        }
      });
    }
  }

  confirmarExclusao(): void {
    this.modalService.open(this.confirmacaoExclusaoModal, { centered: true });
  }

  procederExclusao(): void {
    if (this.produto && this.produto.id) {
      this.produtoService.deleteProduto(this.produto.id).subscribe({
        next: (res) => {
          console.log('Produto excluído com sucesso', res);
          this.modalService.open(this.successModal, { centered: true });
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao excluir produto', err);
          this.errorMessage = 'Erro ao excluir produto. Tente novamente.';
          this.modalService.open(this.errorModal, { centered: true });
        }
      });
    }
    this.modalService.dismissAll(); // Fecha o modal de confirmação
  }

  cancelarExclusao(): void {
    this.modalService.dismissAll();
  }

  resetForm() {
    this.produto = null;
    this.searchCode = '';
    this.produtoEncontrado = false;
    if (this.searchForm) {
      this.searchForm.resetForm();
    }
  }
}
