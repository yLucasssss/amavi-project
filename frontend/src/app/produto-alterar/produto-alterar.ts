import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProdutoService, Produto } from '../services/produto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { ParametrizacaoService, TipoProduto, ValorProduto } from '../services/parametrizacao.service';

@Component({
  selector: 'app-produto-alterar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './produto-alterar.html',
  styleUrls: ['./produto-alterar.css']
})
export class ProdutoAlterarComponent implements OnInit {

  searchCode: string = '';
  produto: Produto | null = null;
  produtoEncontrado: boolean = false;
  errorMessage: string = '';
  tiposProduto: TipoProduto[] = [];
  valoresProduto: ValorProduto[] = [];

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('alterarForm')
  private alterarForm!: NgForm;
  @ViewChild('searchForm') // Adicionado para acessar o formulário de busca
  private searchForm!: NgForm;

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
      console.log('Tipos de Produto carregados:', this.tiposProduto);
    });
    this.parametrizacaoService.getValoresProduto().subscribe(data => {
      this.valoresProduto = data.map(item => ({ ...item, valor: parseFloat(item.valor as any) }));
      console.log('Valores de Produto carregados:', this.valoresProduto);
    });
  }

  buscarProduto() {
    if (this.searchCode) {
      this.produtoService.getProdutoByCodigo(this.searchCode).subscribe({
        next: (data) => {
          this.produto = {
            ...data,
            valor: parseFloat(data.valor as any)
          };
          this.produtoEncontrado = true;
          this.errorMessage = '';
          console.log('Produto buscado e valor parseado:', this.produto);
          if (this.valoresProduto.length > 0 && this.produto) {
            const matchedValue = this.valoresProduto.find(v => v.valor === this.produto?.valor);
            console.log('Valor do produto no select (deve ser selecionado):', this.produto.valor);
            console.log('Valores disponíveis no select:', this.valoresProduto.map(v => v.valor));
            console.log('Valor do produto corresponde a uma opção?', !!matchedValue);
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

  salvarAlteracoes() {
    if (this.produto && this.produto.id) {
      this.produtoService.updateProduto(this.produto.id, this.produto).subscribe({
        next: (res) => {
          console.log('Produto atualizado com sucesso', res);
          this.modalService.open(this.successModal, { centered: true }).result.then(() => {
            setTimeout(() => {
              this.resetForm();
            }, 0);
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

  resetForm() {
    if (this.alterarForm) {
      this.alterarForm.resetForm();
    }
    if (this.searchForm) { // Resetar o formulário de busca também
      this.searchForm.resetForm();
    }
    this.produto = null;
    this.produtoEncontrado = false;
    this.searchCode = '';
    this.errorMessage = ''; // Limpar a mensagem de erro
  }
}