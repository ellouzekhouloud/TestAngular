import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { ChargeTrackerService } from './charge-tracker.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient, private router: Router, private chargeTracker: ChargeTrackerService) { }

  login(email: string, motDePasse: string) {
    return this.http.post<any>(this.apiUrl, { email, motDePasse }).pipe(
      tap(response => {
        console.log('Réponse de la connexion:', response); 
        localStorage.setItem('token', response.accessToken); 
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('role', response.role);
        localStorage.setItem('nom', response.nom);
        localStorage.setItem("personnelId", response.personnelId);
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('role');
    localStorage.removeItem('nom');
    this.chargeTracker.clearChargeId();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  getNom(): string | null {
    return localStorage.getItem('nom');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }
}
