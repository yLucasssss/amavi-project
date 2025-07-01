import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ProdutoService, Produto } from '../services/produto';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { ParametrizacaoService, TipoProduto, ValorProduto } from '../services/parametrizacao.service';

@Component({
  selector: 'app-produto-cadastro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produto-cadastro.html',
  styleUrls: ['./produto-cadastro.css']
})
export class ProdutoCadastroComponent implements OnInit {

  produto: Produto = { codigo: '', tipo: '', valor: 0 };
  errorMessage: string = '';
  tiposProduto: TipoProduto[] = [];
  valoresProduto: ValorProduto[] = [];

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('produtoForm')
  private produtoForm!: NgForm;

  constructor(
    private produtoService: ProdutoService, 
    private parametrizacaoService: ParametrizacaoService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.carregarParametrizacao();
  }

  carregarParametrizacao(): void {
    this.parametrizacaoService.getTiposProduto().subscribe(data => {
      this.tiposProduto = data;
      if (data.length > 0) {
        this.produto.tipo = data[0].nome;
      }
    });
    this.parametrizacaoService.getValoresProduto().subscribe(data => {
      this.valoresProduto = data.map(item => ({ ...item, valor: parseFloat(item.valor as any) }));
      if (data.length > 0) {
        this.produto.valor = this.valoresProduto[0].valor;
      }
    });
  }

  cadastrarProduto() {
    this.produtoService.createProduto(this.produto).subscribe({
      next: (res) => {
        console.log('Produto cadastrado com sucesso', res);
        this.modalService.open(this.successModal, { centered: true });
        this.resetForm();
      },
      error: (err: HttpErrorResponse) => {
        console.error('Erro ao cadastrar produto', err);
        if (err.status === 409 && err.error && err.error.message) {
          this.errorMessage = err.error.message; // Mensagem específica do backend
        } else {
          this.errorMessage = 'Erro ao cadastrar produto. Tente novamente.';
        }
        this.modalService.open(this.errorModal, { centered: true });
      }
    });
  }

  resetForm() {
    this.produto = { codigo: '', tipo: '', valor: 0 };
    if (this.produtoForm) {
      this.produtoForm.resetForm();
    }
    this.carregarParametrizacao();
  }
}
