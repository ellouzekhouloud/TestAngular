import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FicheDeRefusService {
  private apiUrl = 'http://localhost:8080/api/fichesRefus'; // Ton Spring Boot

  constructor(private http: HttpClient) { }

  saveFicheDeRefus(ficheDeRefus: any): Observable<any> {
    return this.http.post(this.apiUrl, ficheDeRefus).pipe(
      tap(() => {
        // ➡️ Après succès, on met à jour localStorage
        let currentCount = Number(localStorage.getItem('nombreFichesDeRefus')) || 0;
        currentCount++;
        localStorage.setItem('nombreFichesDeRefus', currentCount.toString());
      })
    );}

  getAllFichesDeRefus(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}
