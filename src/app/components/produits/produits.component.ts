import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FamilleService } from 'src/app/services/famille.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Produit, ProduitService } from 'src/app/services/produit.service';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  @ViewChild('ficheInput') ficheInputRef!: ElementRef;
  @ViewChild('imageInput') imageInputRef!: ElementRef;

  produits: any[] = [];
  filteredProduits: Produit[] = [];
  searchQuery: string = '';

  produitForm!: FormGroup;
  fournisseurs: any[] = [];
  familles: any[] = [];
  isModalOpen = false;
  imagePath: string | ArrayBuffer | null = null;
  ficheTechniquePath: string | ArrayBuffer | null = null;

   // Pagination
currentPage: number = 1;
itemsPerPage: number = 4;


  constructor(private produitService: ProduitService, private router: Router, private fb: FormBuilder,
    private fournisseurService: FournisseurService,
    private familleService: FamilleService, private http: HttpClient) { }

  ngOnInit(): void {
    this.getProduits();
    // Initialiser le formulaire
    this.produitForm = this.fb.group({
      reference: ['', Validators.required],
      nom: ['', Validators.required],
      imagePath: [''],
      ficheTechniquePath: [''],
      fournisseur: [null, Validators.required],
      famille: [null, Validators.required],
      moq: ['', Validators.required],
      
    });
    // Récupérer les produits, fournisseurs, familles
    this.produitService.getProduits().subscribe(produits => this.produits = produits);
    this.fournisseurService.getFournisseurs().subscribe(fournisseurs => this.fournisseurs = fournisseurs);
    this.familleService.getAllFamilles().subscribe(familles => this.familles = familles);

  }

  
  getPaginatedProduit(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredProduits.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredProduits.length / this.itemsPerPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  
  }
  paginationPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);
  
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  
    return pages;
  }

  openAddProductModal(): void {
    this.produitForm.reset();
    this.imagePath = null;
    this.isModalOpen = true;
  }
  closeAddProductModal(): void {
    this.isModalOpen = false;
    this.produitForm.reset();
    this.imagePath = null;
    this.ficheTechniquePath = null;
  }
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('addProduitModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.produitForm.reset(); 
  
        // ✅ Réinitialiser manuellement les champs fichier
        if (this.ficheInputRef) this.ficheInputRef.nativeElement.value = '';
        if (this.imageInputRef) this.imageInputRef.nativeElement.value = '';
      });
    }
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
  // upload ficheTechnique
  onFicheTechniqueUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.http.post(`http://localhost:8080/api/produits/uploadFicheTechnique`, formData, { responseType: 'text' })
        .subscribe(
          (responseText) => {
            try {
              const response = JSON.parse(responseText);
              console.log('Réponse backend parsée:', response);
              this.produitForm.patchValue({ ficheTechniquePath: response.ficheTechniquePath });
              this.ficheTechniquePath = 'http://localhost:8080' + response.ficheTechniquePath;
            } catch (e) {
              console.error("Erreur lors du parsing de la réponse", e);
            }
          },
          (error) => {
            console.error('Erreur lors de l\'upload de la fiche technique', error);
          }
        );
    }
  }

  


  // Soumettre le produit
  onSubmit(): void {
    if (this.produitForm.valid) {
      const produit = {
        reference: this.produitForm.value.reference,
        nom: this.produitForm.value.nom,
        imagePath: this.produitForm.value.imagePath, 
        fournisseur: {
          idFournisseur: this.produitForm.value.fournisseur
        },
        ficheTechniquePath: this.produitForm.value.ficheTechniquePath,
        famille: {
          idFamille: this.produitForm.value.famille 
        },
        moq: this.produitForm.value.moq,
      };
  
      // Envoyer le produit au backend
      this.produitService.addProduit(produit).subscribe(
        () => {
          alert('Produit ajouté avec succès!');  
          this.closeAddProductModal();  
          this.produitForm.reset();
          this.imagePath = null;  // ✅ Réinitialiser image
        this.ficheTechniquePath = null;  // ✅ Réinitialiser fiche technique  
          this.getProduits();  
          setTimeout(() => {
            const closeBtn = document.getElementById('closeProduitModalBtn') as HTMLElement;
            if (closeBtn) closeBtn.click();
          }, 100);
        
        },
        (error) => {
          console.error('Erreur lors de l\'ajout du produit:', error);
        }
      );
    }
  }
  // Récupère la liste des produits
  getProduits(): void {
    this.produitService.getProduits().subscribe(
      (response) => {
        this.produits = response;
        this.filteredProduits = response;
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
          this.filteredProduits = this.filteredProduits.filter(p => p.idProduit !== idProduit);
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

  // Méthode pour filtrer les fournisseurs par certificat
  searchProduits(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredProduits = this.produits;
    } else {
      this.filteredProduits = this.produits.filter(p =>
        p.reference.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.fournisseur.nomFournisseur.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

  }
  gererPlanDeControle(idProduit: number) {
    const selectedProduit = this.filteredProduits.find(prod => prod.idProduit === idProduit);
    if (selectedProduit) {
      this.router.navigate(['/plans-de-controle', idProduit], { state: { produit: selectedProduit } });
    }
  }
}
