import { Component, OnInit } from '@angular/core';
import { Produto, ProdutoService } from '../services/produto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorio-produtos',
  templateUrl: './relatorio-produtos.html',
  styleUrls: ['./relatorio-produtos.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RelatorioProdutosComponent implements OnInit {
  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.produtoService.getProdutos().subscribe(data => {
      this.produtos = data;
    });
  }
}