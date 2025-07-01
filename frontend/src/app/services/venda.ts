import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Venda {
  id?: number;
  produto_id: number;
  data_venda?: string;
}

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private apiUrl = 'http://localhost:3000/api/vendas';

  constructor(private http: HttpClient) { }

  getVendas(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl);
  }

  createVenda(venda: Venda): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda);
  }

  deleteVenda(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  deleteVendaByProdutoCodigo(codigo: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/by-produto-codigo/${codigo}`);
  }
}