import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produit } from './produit.service';

export interface Fournisseur {
  idFournisseur: number;
  nomFournisseur: string;
  certificat: string;
  email: string;
  adresse: string;
  telephone: string;
}
@Injectable({
  providedIn: 'root'
})
export class FournisseurService {
  private apiUrl = 'http://localhost:8080/api/fournisseurs';

  constructor(private http: HttpClient) {}

  getFournisseurs(): Observable<Fournisseur[]> {
    return this.http.get<Fournisseur[]>(this.apiUrl);
  }

  addFournisseur(fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.post<Fournisseur>(this.apiUrl, fournisseur);
  }

  updateFournisseur(id: number, fournisseur: Fournisseur): Observable<Fournisseur> {
    return this.http.put<Fournisseur>(`${this.apiUrl}/${id}`, fournisseur);
  }

  deleteFournisseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProduitsByFournisseur(idFournisseur: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`http://localhost:8080/api/produits/fournisseur/${idFournisseur}/produits`);
  }
  
}
