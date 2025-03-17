import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Personnel {
  id: number;
  nom: string;
  prenom:string
  email: string;
  adresse: string;
  telephone: string;
  poste: string;
}


@Injectable({
  providedIn: 'root'
})
export class PersonnelService {
  private apiUrl = 'http://localhost:8080/api/personnels';

  constructor(private http: HttpClient) { }

  // Méthode pour récupérer la liste des personnels
  getPersonnels(): Observable<Personnel[]> {
    return this.http.get<Personnel[]>(this.apiUrl);
  }

  // Méthode pour ajouter un personnel
  addPersonnel(personnel: any): Observable<any> {
    return this.http.post(this.apiUrl, personnel);
  }

  // Méthode pour mettre à jour un personnel existant
  updatePersonnel(id: number, personnel: Personnel): Observable<Personnel> {
    return this.http.put<Personnel>(`${this.apiUrl}/${id}`, personnel);
  }

  // Méthode pour supprimer un personnel
  deletePersonnel(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
