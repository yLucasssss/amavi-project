import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametrizacaoService, TipoProduto, ValorProduto } from '../services/parametrizacao.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parametrizacao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './parametrizacao.component.html',
  styleUrls: ['./parametrizacao.component.css']
})
export class ParametrizacaoComponent implements OnInit {

  tiposProduto: TipoProduto[] = [];
  valoresProduto: ValorProduto[] = [];

  novoTipo: string = '';
  novoValor: number | null = null;

  @ViewChild('confirmacaoExclusaoModal')
  private confirmacaoExclusaoModal!: TemplateRef<any>;

  itemToDeleteId: number | undefined;
  itemToDeleteType: 'tipo' | 'valor' | undefined;

  constructor(private parametrizacaoService: ParametrizacaoService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.carregarTipos();
    this.carregarValores();
  }

  carregarTipos(): void {
    this.parametrizacaoService.getTiposProduto().subscribe(data => {
      this.tiposProduto = data;
    });
  }

  carregarValores(): void {
    this.parametrizacaoService.getValoresProduto().subscribe(data => {
      this.valoresProduto = data.map(item => ({ ...item, valor: parseFloat(item.valor as any) }));
    });
  }

  adicionarTipo(): void {
    if (this.novoTipo) {
      this.parametrizacaoService.addTipoProduto({ nome: this.novoTipo }).subscribe(() => {
        this.carregarTipos();
        this.novoTipo = '';
      });
    }
  }

  adicionarValor(): void {
    if (this.novoValor) {
      this.parametrizacaoService.addValorProduto({ valor: this.novoValor }).subscribe(() => {
        this.carregarValores();
        this.novoValor = null;
      });
    }
  }

  confirmarExclusao(id: number | undefined, type: 'tipo' | 'valor'): void {
    this.itemToDeleteId = id;
    this.itemToDeleteType = type;
    this.modalService.open(this.confirmacaoExclusaoModal, { centered: true });
  }

  procederExclusao(): void {
    if (this.itemToDeleteId && this.itemToDeleteType) {
      if (this.itemToDeleteType === 'tipo') {
        this.parametrizacaoService.deleteTipoProduto(this.itemToDeleteId).subscribe(() => {
          this.carregarTipos();
          this.modalService.dismissAll();
        });
      } else if (this.itemToDeleteType === 'valor') {
        this.parametrizacaoService.deleteValorProduto(this.itemToDeleteId).subscribe(() => {
          this.carregarValores();
          this.modalService.dismissAll();
        });
      }
    }
  }

  cancelarExclusao(): void {
    this.itemToDeleteId = undefined;
    this.itemToDeleteType = undefined;
    this.modalService.dismissAll();
  }
}
