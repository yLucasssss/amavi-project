import { Component, OnInit } from '@angular/core';
import { Venda, VendaService } from '../services/venda';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-relatorio-vendas',
  templateUrl: './relatorio-vendas.html',
  styleUrls: ['./relatorio-vendas.css'],
  standalone: true,
  imports: [CommonModule]
})
export class RelatorioVendasComponent implements OnInit {
  vendas: any[] = [];

  constructor(private vendaService: VendaService) { }

  ngOnInit(): void {
    this.vendaService.getVendas().subscribe(data => {
      this.vendas = data;
    });
  }
}