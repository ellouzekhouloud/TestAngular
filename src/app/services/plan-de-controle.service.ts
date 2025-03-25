import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanDeControleService {
  private apiUrl = 'http://localhost:8080/api/plans-de-controle';

  constructor(private http: HttpClient) {}

  // Fonction pour récupérer les headers avec le token
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  
  getPlansByProduit(idProduit: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produit/${idProduit}`, { headers: this.getHeaders() });
  }

  
  ajouterPlan(plan: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajouter`, plan, { headers: this.getHeaders() });
  }

 
  modifierPlan(plan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifier`, plan, { headers: this.getHeaders() });
  }

  
  supprimerPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimer/${id}`, { headers: this.getHeaders() });
  }
}
