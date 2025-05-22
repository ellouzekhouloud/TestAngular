import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BlService } from 'src/app/services/bl.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-add-bl',
  templateUrl: './add-bl.component.html',
  styleUrls: ['./add-bl.component.css']
})
export class AddBlComponent implements OnInit {
  blForm!: FormGroup;
  fournisseurs: any[] = [];
  produitsDisponibles: any[] = []; // Produits disponibles pour le fournisseur sélectionné

  constructor(
    private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private produitService: ProduitService,
    private blService: BlService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Initialisation du formulaire
    this.blForm = this.fb.group({
      numBL: ['', Validators.required],
      dateReception: ['', Validators.required],
      idFournisseur: [null, Validators.required],
      numClient: ['', Validators.required],
      reference: ['', Validators.required],
      referenceInterne: ['', Validators.required],
      description: ['', Validators.required],
      produits: this.fb.array([])  // Tableau dynamique pour les produits
    });

    // Charger les fournisseurs
    this.fournisseurService.getFournisseurs().subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
    });
  }

  /**
   * Récupérer les produits liés au fournisseur sélectionné
   */
  onFournisseurChange(event: any): void {
    const fournisseurId = event.target.value;
    
    if (fournisseurId) {
      this.produitService.getProduitsByFournisseur(fournisseurId).subscribe(
        (produits) => {
          this.produitsDisponibles = produits;
          console.log("Produits récupérés : ", this.produitsDisponibles);

          if (this.produitsDisponibles.length === 0) {
            alert("Aucun produit disponible pour ce fournisseur.");
          }
        },
        (error) => {
          console.error("Erreur lors de la récupération des produits : ", error);
        }
      );
    } else {
      this.produitsDisponibles = [];
    }
  }

  /**
   * Getter pour l'array des produits
   */
  get produitsFormArray(): FormArray {
    return this.blForm.get('produits') as FormArray;
  }

  /**
   * Ajouter un produit dans le tableau dynamique
   */
  addProduit(): void {
    const produitFormGroup = this.fb.group({
      idProduit: [null, Validators.required],
      quantité: [null, [Validators.required, Validators.min(1)]]
    });

    this.produitsFormArray.push(produitFormGroup);
  }

  /**
   * Supprimer un produit de la liste
   */
  removeProduit(index: number): void {
    this.produitsFormArray.removeAt(index);
  }

  /**
   * Soumettre le formulaire
   */
  onSubmit(): void {
  if (this.blForm.valid) {
    const bl = {
      numBL: this.blForm.value.numBL,
      dateReception: this.blForm.value.dateReception
        ? new Date(this.blForm.value.dateReception).toISOString().split('T')[0]
        : null,
      idFournisseur: this.blForm.value.idFournisseur,
      numClient: this.blForm.value.numClient,
      reference: this.blForm.value.reference,
      referenceInterne: this.blForm.value.referenceInterne,
      description: this.blForm.value.description,
      produits: this.blForm.value.produits
    };

    this.blService.addBl(bl).subscribe(
      (response) => {
        alert('Bon de livraison créé avec succès');
        // Redirection avec un paramètre de navigation
        this.router.navigate(['/ListBL'], { state: { newBL: response } });
      },
      (error) => {
        console.error('Erreur lors de la création du bon de livraison', error);
      }
    );
  }
}

}
