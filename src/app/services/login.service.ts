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
  login(email: string, motDePasse: string, rememberMe: boolean) {
    return this.http.post<any>(this.apiUrl, { email, motDePasse }).pipe(
      tap(response => {
        console.log('Réponse de la connexion:', response);

        // 🔄 Gestion de l'option "Se souvenir de moi"
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('token', response.accessToken);
        storage.setItem('refreshToken', response.refreshToken);
        storage.setItem('role', response.role);
        storage.setItem('nom', response.nom);
        storage.setItem('personnelId', response.personnelId);
      })
    );
  }

  logout() {
    // 🔄 Suppression dans les deux stockages
    localStorage.clear();
    sessionStorage.clear();
    
    this.chargeTracker.clearChargeId(); 
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    // ✅ On récupère le token depuis l'un ou l'autre stockage
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken') || sessionStorage.getItem('refreshToken');
  }

  getRole(): string | null {
    return localStorage.getItem('role') || sessionStorage.getItem('role');
  }

  getNom(): string | null {
    return localStorage.getItem('nom') || sessionStorage.getItem('nom');
  }

  isLoggedIn(): boolean {
    // ✅ Vérification dans les deux stockages
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.getToken()}`
    });
  }
}
