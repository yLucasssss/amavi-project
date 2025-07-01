import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService, Produto } from '../services/produto';
import { VendaService, Venda } from '../services/venda';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-venda-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venda-cadastro.html',
  styleUrls: ['./venda-cadastro.css']
})
export class VendaCadastroComponent {

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

  constructor(private produtoService: ProdutoService, private vendaService: VendaService, private modalService: NgbModal) { }

  buscarProduto() {
    if (this.searchCode) {
      this.produtoService.getProdutoByCodigo(this.searchCode).subscribe({
        next: (data) => {
          if (data && data.status === 'disponivel') {
            this.produto = data;
            this.produtoEncontrado = true;
            this.errorMessage = '';
          } else {
            this.produtoEncontrado = false;
            this.produto = null;
            this.errorMessage = 'Produto não disponível para venda.';
            this.modalService.open(this.errorModal, { centered: true });
          }
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

  confirmarVenda() {
    if (this.produto && this.produto.id) {
      const novaVenda: Venda = { produto_id: this.produto.id };
      this.vendaService.createVenda(novaVenda).subscribe({
        next: (res) => {
          console.log('Venda realizada com sucesso', res);
          this.modalService.open(this.successModal, { centered: true });
          this.resetForm();
        },
        error: (err: HttpErrorResponse) => {
          console.error('Erro ao registrar venda', err);
          this.errorMessage = 'Erro ao registrar venda. Tente novamente.';
          this.modalService.open(this.errorModal, { centered: true });
        }
      });
    }
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
