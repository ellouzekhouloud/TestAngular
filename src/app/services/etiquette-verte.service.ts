import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Etiquette {
  id: number;
  
  reference: string;
  fournisseur: string;
  verificateur: string;
  numBL: string;
  dateDeControle: string; // ISO format
  resultat: string;
 
}
@Injectable({
  providedIn: 'root'
})
export class EtiquetteVerteService {

  private apiUrl = 'http://localhost:8080/api/etiquettes'; 

  constructor(private http: HttpClient) { }

  saveEtiquette(etiquette: any): Observable<any> {
    return this.http.post(this.apiUrl, etiquette);
  }

  getAllEtiquettes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
}
