import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanDeControleService {

  
  private apiUrl = 'http://localhost:8080/api/plans-de-controle';

  constructor(private http: HttpClient) {}

  getPlansByProduit(idProduit: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/produit/${idProduit}`);
  }

  ajouterPlan(plan: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/ajouter`, plan);
  }

  modifierPlan(plan: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/modifier`, plan);
  }

  supprimerPlan(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/supprimer/${id}`);
  }
}
