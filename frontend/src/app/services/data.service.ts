import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private apiUrl = "http://localhost:5000";  

  constructor(private http: HttpClient) { }

  listarUsuarios(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/listar-usuarios`, { headers });
  }

  atualizarUsuario(id: number, dados: any, token: string) {
    return this.http.put<any>(`http://localhost:5000/atualizar-usuario/${id}`, dados, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


  deletarUsuario(id: number, token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/deletar-usuario/${id}`, { headers });
  }

  criarUsuario(novoUsuario: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/criar-usuario`, novoUsuario, { headers });
  }
}