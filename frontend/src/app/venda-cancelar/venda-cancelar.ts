import { Component, ViewChild, TemplateRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VendaService, Venda } from '../services/venda';
import { ProdutoService, Produto } from '../services/produto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-venda-cancelar',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './venda-cancelar.html',
  styleUrls: ['./venda-cancelar.css']
})
export class VendaCancelarComponent {

  searchCode: string = '';
  venda: Venda | null = null;
  produtoAssociado: Produto | null = null;
  vendaEncontrada: boolean = false;
  errorMessage: string = '';

  @ViewChild('successModal')
  private successModal!: TemplateRef<any>;
  @ViewChild('errorModal')
  private errorModal!: TemplateRef<any>;
  @ViewChild('confirmModal')
  private confirmModal!: TemplateRef<any>;
  @ViewChild('searchCodeForm')
  private searchCodeForm!: NgForm;

  constructor(private vendaService: VendaService, private produtoService: ProdutoService, private modalService: NgbModal) { }

  reverterVendaPorCodigo() {
    if (this.searchCode) {
      this.modalService.open(this.confirmModal, { centered: true }).result.then((result) => {
        if (result === 'confirm') {
          this.vendaService.deleteVendaByProdutoCodigo(this.searchCode).pipe(
            catchError((err: HttpErrorResponse) => {
              if (err.status === 404) {
                this.errorMessage = 'Produto não vendido. Verifique e tente novamente.';
              } else {
                this.errorMessage = 'Erro ao reverter venda. Tente novamente.';
              }
              this.modalService.open(this.errorModal, { centered: true });
              return EMPTY; // Retorna EMPTY para parar a propagação do erro
            })
          ).subscribe({
            next: () => {
              console.log('Venda revertida com sucesso');
              this.modalService.open(this.successModal, { centered: true });
              this.resetForm();
            },
            error: (err: HttpErrorResponse) => {
              // Este bloco não será mais alcançado se o catchError retornar EMPTY
              console.error('Erro no subscribe (após catchError): ', err);
            }
          });
        }
      });
    }
  }

  resetForm() {
    this.venda = null;
    this.produtoAssociado = null;
    this.searchCode = '';
    this.vendaEncontrada = false;
    if (this.searchCodeForm) {
      this.searchCodeForm.resetForm();
    }
  }
}
