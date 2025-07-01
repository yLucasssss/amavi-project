import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TipoProduto {
  id?: number;
  nome: string;
}

export interface ValorProduto {
  id?: number;
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class ParametrizacaoService {

  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  // Tipos de Produto
  getTiposProduto(): Observable<TipoProduto[]> {
    return this.http.get<TipoProduto[]>(`${this.apiUrl}/tipos-produto`);
  }

  addTipoProduto(tipo: TipoProduto): Observable<TipoProduto> {
    return this.http.post<TipoProduto>(`${this.apiUrl}/tipos-produto`, tipo);
  }

  deleteTipoProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/tipos-produto/${id}`);
  }

  // Valores de Produto
  getValoresProduto(): Observable<ValorProduto[]> {
    return this.http.get<ValorProduto[]>(`${this.apiUrl}/valores-produto`);
  }

  addValorProduto(valor: ValorProduto): Observable<ValorProduto> {
    return this.http.post<ValorProduto>(`${this.apiUrl}/valores-produto`, valor);
  }

  deleteValorProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/valores-produto/${id}`);
  }
}
