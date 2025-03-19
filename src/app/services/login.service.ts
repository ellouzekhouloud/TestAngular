import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = 'http://localhost:8080/auth/login'; 

  constructor(private http: HttpClient) { }

 login(email: string, motDePasse: string) {
  return this.http.post<any>('http://localhost:8080/auth/login', 
    { email, motDePasse }, 
    { headers: { 'Content-Type': 'application/json' }, observe: 'response' }
  );
}

}



