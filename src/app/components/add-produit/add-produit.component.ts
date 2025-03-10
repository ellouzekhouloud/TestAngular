import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProduitService } from 'src/app/services/produit.service';
import { FournisseurService } from 'src/app/services/fournisseur.service'; // Service pour récupérer les fournisseurs
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-add-produit',
  templateUrl: './add-produit.component.html',
  styleUrls: ['./add-produit.component.css']
})
export class AddProduitComponent implements OnInit {
  produitForm!: FormGroup;
  fournisseurs: any[] = [];
  imagePath: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private produitService: ProduitService,
    private fournisseurService: FournisseurService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialisation du formulaire
    this.produitForm = this.fb.group({
      reference: ['', Validators.required],
      nom: ['', Validators.required],
      description: ['', Validators.required],
      prix: [null, [Validators.required, Validators.min(0)]],
      imagePath: [''],
      fournisseur: [null, Validators.required],
      caracteristiques: this.fb.array([]),
    });

    // Récupérer la liste des fournisseurs
    this.fournisseurService.getFournisseurs().subscribe((fournisseurs) => {
      this.fournisseurs = fournisseurs;
    });
  }

  // Getter pour l'array des caractéristiques
  get caracteristiques(): FormArray {
    return this.produitForm.get('caracteristiques') as FormArray;
  }

  // Ajouter une caractéristique
  addCaracteristique(): void {
    const caracteristique = this.fb.group({
      nom: ['', Validators.required],
      valeur: ['', Validators.required]
    });
    this.caracteristiques.push(caracteristique);
  }

  // Gérer le changement de l'image
  onImageUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      this.http.post('http://localhost:8080/api/produits/uploadImage', formData, { responseType: 'text' }).subscribe(
        (responseText) => {
          try {
            const response = JSON.parse(responseText); // ✅ Convertir manuellement en JSON
            console.log('Réponse backend parsée:', response);
            this.produitForm.patchValue({ imagePath: response.imagePath });
            this.imagePath = 'http://localhost:8080' + response.imagePath;
          } catch (e) {
            console.error("Erreur lors du parsing de la réponse", e);
          }
        },
        (error) => {
          console.error('Erreur lors de l\'upload de l\'image', error);
        }
      );
    }
  }
  

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.produitForm.valid) {
      const produit = {
        reference: this.produitForm.value.reference,
        nom: this.produitForm.value.nom,
        description: this.produitForm.value.description,
        prix: this.produitForm.value.prix,
        imagePath: this.produitForm.value.imagePath, // Vous pouvez envoyer un chemin d'image ou l'image elle-même
        fournisseur: {
          idFournisseur: this.produitForm.value.fournisseur
        },
        caracteristiques: this.produitForm.value.caracteristiques
      };

      // Envoyer le produit au backend
      this.produitService.addProduit(produit).subscribe(
        () => {
          alert('Produit ajouté avec succès!');
          this.router.navigate(['/produits']); // Rediriger vers la liste des produits
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit:', error);
        }
      );
    }
  }
}
