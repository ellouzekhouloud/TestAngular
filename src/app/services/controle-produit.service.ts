import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ControleProduitService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/produits';
  private apiUrl2 = 'http://localhost:8080/api/controles';
  private apiUrl3 = 'http://localhost:8080/api/bl';

  getProduitById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getPlansDeControleByProduit(idProduit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idProduit}/plansDeControle`);
  }

getProduitByReference(reference: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/reference/${reference}`);
  }

  // Charger les produits d’un BL
  getProduitsDuBL(blId: number) {
    return this.http.get<any[]>(`http://localhost:8080/api/bl/${blId}/produits`);
  }

   
  // Vérifier si tous les produits sont contrôlés pour ce BL
  verifierBLTermine(idBL: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    console.log(`Vérification si le BL ${idBL} est terminé...`);
  
    return this.http.put<any>(`${this.apiUrl3}/${idBL}/terminer`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Erreur lors de la vérification du BL:', error);
        return throwError(error);
      })
    );
  }

  marquerProduitCommeControle(id: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.put<any>(`${this.apiUrl3}/produits/${id}/controle`, {}, { headers });
  }

  enregistrerControle(data: any): Observable<string> {
      const token = localStorage.getItem('token'); 
  
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
  
      console.log("Données envoyées :", data); 
  
      return this.http.post(this.apiUrl2 + '/enregistrer', data, { headers, responseType: 'text' })
        .pipe(
          catchError(error => {
            console.error("Erreur lors de l'enregistrement du contrôle :", error);
            return throwError(error); 
          })
        );
    }

    // Méthode pour récupérer les produits contrôlés pour un BL donné
  getProduitsControles(blId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl3}/${blId}/produits-controles-details`);
  }
}
