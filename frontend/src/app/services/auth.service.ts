import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "https://emcale-erp.onrender.com";
  // private apiUrl = "http://127.0.0.1:5000";

  constructor(private http: HttpClient) { }


  login(usuario: string, senha: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/login`, {
      usuario,
      senha
    })
  }


}
