import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FamilleService } from 'src/app/services/famille.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Produit, ProduitService } from 'src/app/services/produit.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

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

editProduitForm!: FormGroup;
editProduitId: number = 0;
editImagePreview: string | ArrayBuffer | null = null;
editFichePreview: string | ArrayBuffer | null = null;
editProduitModalInstance: any;

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

this.editProduitForm = this.fb.group({
  reference: ['', Validators.required],
  nom: ['', Validators.required],
  imagePath: [''],
  ficheTechniquePath: [''],
  fournisseur: [null, Validators.required],
  famille: [null, Validators.required],
  moq: ['', Validators.required],
});
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

    this.produitService.addProduit(produit).subscribe(
      () => {
        // ✅ Succès
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Produit ajouté avec succès !',
          showConfirmButton: false,
          timer: 2000
        });

        this.produitForm.reset();
        this.imagePath = null;
        this.ficheTechniquePath = null;
        this.getProduits();

        setTimeout(() => {
          const closeBtn = document.getElementById('closeProduitModalBtn') as HTMLElement;
          if (closeBtn) closeBtn.click();
        }, 100);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du produit:', error);

        const backendMessage = error.error?.message;

        if (backendMessage && backendMessage.includes('référence')) {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: backendMessage  // Affiche "Cette référence existe déjà."
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Cette référence existe déjà. Veuillez en saisir une autre.'
          });
        }
      }
    );
  } else {
    // ⚠️ Formulaire invalide
    Swal.fire({
      icon: 'warning',
      title: 'Champs incomplets',
      text: 'Veuillez remplir tous les champs obligatoires !',
    });
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

 supprimerProduit(idProduit: number): void {
  Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: "Cette action est irréversible !",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.produitService.deleteProduit(idProduit).subscribe(
        () => {
          this.produits = this.produits.filter(produit => produit.idProduit !== idProduit);
          this.filteredProduits = this.filteredProduits.filter(p => p.idProduit !== idProduit);
          Swal.fire(
            'Supprimé !',
            'Le produit a été supprimé.',
            'success'
          );
          console.log('Produit supprimé avec succès');
        },
        (error) => {
          console.error('Erreur lors de la suppression du produit:', error);
          Swal.fire(
            'Erreur !',
            'La suppression a échoué.',
            'error'
          );
        }
      );
    }
  });
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

 openEditProductModal(produit: any): void {
  this.editProduitId = produit.idProduit;
  this.editProduitForm.patchValue({
    reference: produit.reference,
    nom: produit.nom,
    imagePath: produit.imagePath,
    ficheTechniquePath: produit.ficheTechniquePath,
    fournisseur: produit.fournisseur?.idFournisseur,
    famille: produit.famille?.idFamille,
    moq: produit.moq
  });
  this.editImagePreview = 'http://localhost:8080' + produit.imagePath;
  this.editFichePreview = 'http://localhost:8080' + produit.ficheTechniquePath;

  const modalElement = document.getElementById('editProduitModal');
  if (modalElement) {
    this.editProduitModalInstance = new bootstrap.Modal(modalElement);
    this.editProduitModalInstance.show();
  }
}

onEditImageUpload(event: any): void {
  const file: File = event.target.files[0];
  const idProduit = this.editProduitId; // tu as ça ici aussi

  if (file && idProduit) {
    this.produitService.uploadImage(idProduit, file).subscribe({
      next: (res: any) => {
        console.log('Réponse upload image :', res);
        const imagePath = res.imagePath || res.path || res;
        this.editProduitForm.controls['imagePath'].setValue(imagePath);
        this.editImagePreview = 'http://localhost:8080' + imagePath;
      },
      error: (err) => {
        console.error('Erreur upload image :', err);
        Swal.fire('Erreur', 'Erreur lors de l\'upload de l\'image', 'error');
      }
    });
  }
}

onEditFicheUpload(event: any): void {
  const file: File = event.target.files[0];
  const idProduit = this.editProduitId;

  if (file && idProduit) {
    this.produitService.uploadFicheTechnique(idProduit, file).subscribe({
      next: (res: any) => {
        console.log('Réponse upload fiche technique :', res);
        const fichePath = res.ficheTechniquePath || res.path || res;
        this.editProduitForm.controls['ficheTechniquePath'].setValue(fichePath);
        this.editFichePreview = 'http://localhost:8080' + fichePath;
      },
      error: (err) => {
        console.error('Erreur upload fiche technique :', err);
        Swal.fire('Erreur', 'Erreur lors de l\'upload de la fiche technique', 'error');
      }
    });
  }
}


onUpdateProduit(): void {
  if (this.editProduitForm.valid) {
    const formValue = this.editProduitForm.value;

    const updatedProduit = {
      reference: formValue.reference,
      nom: formValue.nom,
      moq: formValue.moq,
      imagePath: formValue.imagePath,
      ficheTechniquePath: formValue.ficheTechniquePath,
      fournisseur: { idFournisseur: formValue.fournisseur },
      famille: { idFamille: formValue.famille }
    };

    console.log('Produit à envoyer au backend :', updatedProduit);

    this.produitService.updateProduit(this.editProduitId, updatedProduit).subscribe({
      next: () => {
        Swal.fire('Succès', 'Produit modifié avec succès', 'success');
        if (this.editProduitModalInstance) {
          this.editProduitModalInstance.hide();
        }
        this.getProduits();
      },
      error: (error) => {
        console.error('Erreur lors de la modification :', error);
        Swal.fire('Erreur', 'La modification du produit a échoué', 'error');
      }
    });
  }
}





}
