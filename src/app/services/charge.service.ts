import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChargeService {

  private baseUrl = 'http://localhost:8080/api/charge';

  constructor(private http: HttpClient) {}

  demarrerControle(personnelId: number, blId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/demarrer`, null, {
      params: {
        personnelId: personnelId,
       
        blId: blId
      }
    });
  }

  terminerControle(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/terminer/${id}`, null);
  }

  getControlesByPersonnel(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/personnel/${id}`);
  }

  getTempsTotalByPersonnel(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/personnel/${id}/temps-total`);
  }
}
