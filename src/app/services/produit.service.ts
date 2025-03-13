import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Fournisseur {
  idFournisseur: number;
  nomFournisseur: string;
  email: string;
  adresse: string;
  telephone: string;
}

export interface Caracteristique {
  idCaracteristique: number;
  nom: string;
  valeur: string;
}

export interface Produit {
  idProduit: number;
  référence: string | null;
  nom: string;
  description: string;
  prix: number;
  imagePath: string | null;
  fournisseur: Fournisseur; 
  caracteristiques: Caracteristique[];
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/all`);
  }

  // Ajouter un produit
  addProduit(produit: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`, produit);
  }

  deleteProduit(idProduit: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${idProduit}`);
  }

  uploadImage(idProduit: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/uploadImage/${idProduit}`, formData);
  }

  getFournisseurs(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/api/fournisseurs');
  }
  getProduitsByFournisseur(id: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/fournisseur/${id}`);
  }
}
