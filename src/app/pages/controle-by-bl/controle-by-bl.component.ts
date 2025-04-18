import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScanneService } from 'src/app/services/scanne.service';

@Component({
  selector: 'app-controle-by-bl',
  templateUrl: './controle-by-bl.component.html',
  styleUrls: ['./controle-by-bl.component.css']
})
export class ControleByBlComponent {
  referenceProduit: string = '';
  blProduits: any[] = [];
 

  constructor(private http: HttpClient,private router: Router) {}

  rechercherBL() {
    if (!this.referenceProduit.trim()) {
      return;
    }

    const url = `http://localhost:8080/api/bl/produit/${this.referenceProduit}/bls`;

    this.http.get<any[]>(url).subscribe(
      data => {
        this.blProduits = data;
        
       
      },
      error => {
        console.error('Erreur lors de la récupération des BL :', error);
        this.blProduits = [];
      }
    );
  }

  allerAuControle(idProduit: number, quantite: number, numBL: string) {
    this.router.navigate(['/controle-produit', idProduit], {
      state: {
        quantite: quantite,
        numBL: numBL
      }
    });
  }
}
