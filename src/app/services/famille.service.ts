import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export interface Famille {
  idFamille: number;
  nomFamille: string; 
}

@Injectable({
  providedIn: 'root'
})
export class FamilleService {

 
  private apiUrl = 'http://localhost:8080/api/familles';


  constructor(private http: HttpClient) { }

  // Méthode pour récupérer toutes les familles
  getAllFamilles(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
