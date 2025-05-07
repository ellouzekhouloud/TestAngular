import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';
  private baseUrl = 'http://localhost:8080/api/charge';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  getProduitsParFamille(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits/par-famille`);
  }

  getProduitsParFournisseur(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits/par-fournisseur`);
  }

  getTempsTotalParPersonnel(): Observable<{ [key: string]: string }> {
    return this.http.get<{ [key: string]: string }>(`${this.baseUrl}/charges-par-personnel`);
  }
}
