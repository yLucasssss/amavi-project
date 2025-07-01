import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Produto {
  id?: number;
  codigo: string;
  tipo: string;
  valor: number;
  status?: string; // Adicionado o campo status
}

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private apiUrl = 'http://localhost:3000/api/produtos';

  constructor(private http: HttpClient) { }

  getProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  getProduto(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`);
  }

  getProdutoByCodigo(codigo: string): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/by-codigo/${codigo}`);
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto);
  }

  updateProduto(id: number, produto: Produto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, produto);
  }

  deleteProduto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}