import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = "https://emcale-erp.onrender.com";
  // private apiUrl = "http://127.0.0.1:5000";

  constructor(private http: HttpClient) { }

  listarUsuarios(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/listar-usuarios`, { headers });
  }

  listarTecnicos(token: string) {
    return this.http.get<any>(`${this.apiUrl}/listar-tecnicos`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  listarStatus(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/listar-status`, { headers });
  }


  atualizarUsuario(id: number, dados: any, token: string) {
    return this.http.put<any>(`${this.apiUrl}/atualizar-usuario/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  atualizarTecnico(id: number, dados: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/atualizar-tecnico/${id}`, dados, { headers });
  }

  deletarUsuario(id: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/deletar-usuario/${id}`, { headers });
  }
  deletarTecnico(id: number, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.delete(`${this.apiUrl}/deletar-tecnico/${id}`, { headers });
}

  criarUsuario(novoUsuario: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/criar-usuario`, novoUsuario, { headers });
  }

  criarTecnico(novoTecnico: any, token: string): Observable<any> {
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.post(`${this.apiUrl}/criar-tecnico`, novoTecnico, { headers });
}


  listarOrdens(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/listar-ordens-servico`, { headers });
  }

  criarOrdem(novaOrdem: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/criar-ordem-servico`, novaOrdem, { headers });
  }

  atualizarOrdem(id: number, dados: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/atualizar-ordem-servico/${id}`, dados, { headers });
  }

  deletarOrdem(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/deletar-ordem-servico/${id}`, { headers });
  }
}