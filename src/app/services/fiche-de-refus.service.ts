import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface FicheDeRefus {
  id: number;
  numeroFiche: number;
  quantiteIncorrecte:number;
  reference: string;
  fournisseur: string;
  verificateur: string;
  numBL: string;
  dateDeControle: string; // ISO format
  motifRefus: string;
  raison: string;
}
@Injectable({
  providedIn: 'root'
})
export class FicheDeRefusService {
  private apiUrl = 'http://localhost:8080/api/fichesRefus'; 

  constructor(private http: HttpClient) { }

  saveFicheDeRefus(ficheDeRefus: any): Observable<FicheDeRefus> {
    return this.http.post<FicheDeRefus>(this.apiUrl, ficheDeRefus);
  }

  getAllFichesDeRefus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
