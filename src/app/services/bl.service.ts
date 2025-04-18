import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BLProduit {
  id: number;
  referenceProduit: string;
  quantite: number;
  controleEffectue: boolean;
}
@Injectable({
  providedIn: 'root'
})
export class BlService {
  private apiUrl = 'http://localhost:8080/api/bl/create';  
// Méthode pour envoyer le bon de livraison
addBl(bl: any): Observable<any> {
  return this.http.post(this.apiUrl, bl);
}
  constructor(private http: HttpClient) { }
  getBL(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/bl');
  
  }
  getBlById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/bl/${id}`);
  }

  getProduitsByBL(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/bl/${id}/produits`);
  }
  deleteBl(idBL: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:8080/api/bl/${idBL}`);
  }

  
}
