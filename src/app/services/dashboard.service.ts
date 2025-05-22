import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface BLFicheDeRefusDTO {
  id: number;
  numBL: string;
  reference: string;
  fournisseur: string;
  verificateur: string;
  dateDeControle: string;
  motifRefus: string;
  raison: string;
  quantiteIncorrecte: number;
}

export interface BLEtiquetteVerteDTO {
  id: number;
  numBL: string;
  reference: string;
  fournisseur: string;
  verificateur: string;
  dateDeControle: string;
  resultat: string;
}
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';
  private baseUrl = 'http://localhost:8080/api/charge';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

 
//récupérer les produits par fournisseur
 getProduitsParFournisseur(): Observable<any> {
    return this.http.get(`${this.apiUrl}/produits-par-fournisseur`);
  }
 
  // ✅ Récupérer les produits non conformes par fournisseur
  getNonConformesParFournisseur(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/non-conformes-par-fournisseur?startDate=${startDate}&endDate=${endDate}`);
  }



  getQuantitesParFournisseur(filterType: string, date?: string, startDate?: string, endDate?: string) {
  const params: any = { filterType };

  if (filterType === 'custom') {
    params.startDate = startDate;
    params.endDate = endDate;
  } else {
    params.date = date;
  }

  return this.http.get<any[]>(`${this.apiUrl}/quantites-par-fournisseur`, { params });
}


  getBLNonConformes(fournisseur?: string, date?: string): Observable<BLFicheDeRefusDTO[]> {
    let params = new HttpParams();
    if (fournisseur) {
      params = params.set('fournisseur', fournisseur);
    }
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<BLFicheDeRefusDTO[]>(`${this.apiUrl}/non-conformes`, { params });
  }

  getBlsConformes(fournisseur?: string, date?: string): Observable<BLEtiquetteVerteDTO[]> {
    let params = new HttpParams();
    if (fournisseur) {
      params = params.set('fournisseur', fournisseur);
    }
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<BLEtiquetteVerteDTO[]>(`${this.apiUrl}/traites-succes`, { params });
  }

  getPPM(fournisseur: string) {
    const params = new HttpParams().set('fournisseur', fournisseur);
    return this.http.get<number>(`${this.apiUrl}/ppm`, { params });
  }
}
