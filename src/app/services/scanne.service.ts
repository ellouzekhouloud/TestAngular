import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScanneService {

  private apiUrl = 'http://localhost:8080/api/produits';
  private apiUrl1 = 'http://localhost:8080/api/controles';
    private baseUrl2 = 'http://localhost:8080/api/bl'

  constructor(private http: HttpClient) { }

  getProduitByReference(reference: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reference/${reference}`);
  }

  getPlansDeControleByProduit(idProduit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idProduit}/plansDeControle`);
  }

  getPlanDeControleByReference(reference: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${reference}/plan-de-controle`);
  }

  getQuantityForProductInBL(referenceProduit: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl2}/quantite-produit/${referenceProduit}`);
  }

  getNumBLByReference(reference: string) {
    return this.http.get<string>(`${this.baseUrl2}/numero/${reference}`, { responseType: 'text' as 'json' });
  }

  enregistrerControle(data: any): Observable<string> {
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    console.log("Données envoyées :", data); 

    return this.http.post(this.apiUrl1 + '/enregistrer', data, { headers, responseType: 'text' })
      .pipe(
        catchError(error => {
          console.error("Erreur lors de l'enregistrement du contrôle :", error);
          return throwError(error); 
        })
      );
  }
}
