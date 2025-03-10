import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: any[] = [];

  constructor(private produitService: ProduitService, private router: Router) {}

  ngOnInit(): void {
    this.getProduits();
  }

  // Récupère la liste des produits
  getProduits(): void {
    this.produitService.getProduits().subscribe(
      (response) => {
        this.produits = response;
      },
      (error) => {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    );
  }

  // Supprimer un produit par son ID
  supprimerProduit(idProduit: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(idProduit).subscribe(
        () => {
          // Mise à jour de la liste des produits après suppression
          this.produits = this.produits.filter(produit => produit.idProduit !== idProduit);
          console.log('Produit supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du produit:', error);
        }
      );
    }
  }

  // Rediriger vers la page de modification du produit
  editProduit(idProduit: number): void {
    this.router.navigate([`/modifier-produit/${idProduit}`]);
  }
}
