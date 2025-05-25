import { FournisseurService } from '../../services/fournisseur.service';
import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../../services/fournisseur.service';
import { Produit, ProduitService } from 'src/app/services/produit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  editFournisseurForm: FormGroup;
  selectedFournisseurId: number | null = null;
  filteredFournisseurs: Fournisseur[] = []; 
  searchQuery: string = ''; 
  fournisseurForm: FormGroup;
  successMessage: string = '';
     // Pagination
currentPage: number = 1;
itemsPerPage: number = 4;

  constructor(private FournisseurService: FournisseurService, private ProduitService: ProduitService, private fb: FormBuilder) {
    this.fournisseurForm = this.fb.group({
      nomFournisseur: ['', Validators.required],
      certificat: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern(/^[\d\s()+-]+$/)]]
    });
    
    this.editFournisseurForm = this.fb.group({
      nomFournisseur: ['', Validators.required],
      certificat: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  // Méthode pour récupérer les BL de la page actuelle
  getPaginatedFournisseur(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredFournisseurs.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredFournisseurs.length / this.itemsPerPage);
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

  ngOnInit(): void {
    this.getFournisseurs();
  }

  
  ngAfterViewInit(): void {
    const modalElement = document.getElementById('addFournisseurModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.fournisseurForm.reset(); 
      });
    }
  }

 onSubmit() {
  if (this.fournisseurForm.valid) {
    this.FournisseurService.addFournisseur(this.fournisseurForm.value).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Fournisseur ajouté avec succès !',
          showConfirmButton: false,
          timer: 2000
        });

        this.fournisseurForm.reset();
        this.getFournisseurs();

        setTimeout(() => {
          const closeBtn = document.getElementById('closeModalBtn') as HTMLElement;
          if (closeBtn) closeBtn.click();
        }, 100);
      },
      error => {
        console.error('Erreur lors de l’ajout du fournisseur', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l’ajout du fournisseur.',
        });
      }
    );
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Champs obligatoires',
      text: 'Veuillez remplir tous les champs obligatoires !',
    });
  }
}


  getFournisseurs(): void {
    this.FournisseurService.getFournisseurs().subscribe(data => {
      this.fournisseurs = data;
      this.filteredFournisseurs = data;
    });
  }

 deleteFournisseur(id: number): void {
  Swal.fire({
    title: 'Confirmation',
    text: 'Voulez-vous vraiment supprimer ce fournisseur ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.FournisseurService.deleteFournisseur(id).subscribe(() => {
        this.fournisseurs = this.fournisseurs.filter(f => f.idFournisseur !== id);
        this.filteredFournisseurs = this.filteredFournisseurs.filter(f => f.idFournisseur !== id);
        Swal.fire({
          icon: 'success',
          title: 'Supprimé',
          text: 'Le fournisseur a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la suppression du fournisseur.'
        });
      });
    }
  });
}


  // Ouvrir le modal et remplir le formulaire avec les données du fournisseur
  openEditModal(fournisseur: Fournisseur): void {
    this.selectedFournisseurId = fournisseur.idFournisseur;
    this.editFournisseurForm.setValue({
      nomFournisseur: fournisseur.nomFournisseur,
      certificat: fournisseur.certificat,
      email: fournisseur.email,
      adresse: fournisseur.adresse,
      telephone: fournisseur.telephone
    });
  }

  // Enregistrer les modifications
  onUpdateFournisseur(): void {
  if (this.selectedFournisseurId && this.editFournisseurForm.valid) {
    this.FournisseurService.updateFournisseur(this.selectedFournisseurId, this.editFournisseurForm.value)
      .subscribe(updatedFournisseur => {
        this.fournisseurs = this.fournisseurs.map(f =>
          f.idFournisseur === this.selectedFournisseurId ? updatedFournisseur : f
        );
        this.filteredFournisseurs = this.filteredFournisseurs.map(f =>
          f.idFournisseur === this.selectedFournisseurId ? updatedFournisseur : f
        );

        // Fermer le modal
        document.getElementById('editFournisseurModal')?.classList.remove('show');
        document.body.classList.remove('modal-open');
        document.querySelector('.modal-backdrop')?.remove();

        Swal.fire({
          icon: 'success',
          title: 'Modifié',
          text: 'Le fournisseur a été modifié avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      }, error => {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Erreur lors de la modification du fournisseur.'
        });
      });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Formulaire invalide',
      text: 'Veuillez remplir correctement tous les champs.'
    });
  }
}


  // Méthode pour filtrer les fournisseurs par certificat
  searchFournisseurs(): void {
    if (this.searchQuery.trim() === '') {
      this.filteredFournisseurs = this.fournisseurs;
    } else {
      this.filteredFournisseurs = this.fournisseurs.filter(f =>
        f.certificat.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

  }

  // Ajoutez la méthode printFournisseurs()
  printFournisseurs() {
    const printContent = document.getElementById('fournisseursTable')?.outerHTML;
    const newWindow = window.open('', '', 'height=500,width=800');
    if (newWindow && printContent) {
      // Définir la date de création (ici la date du jour)
      const creationDate = new Date().toLocaleDateString();
  
      newWindow.document.write('<html><head><title>Panel des Fournisseurs</title>');
      newWindow.document.write('<style>');
      newWindow.document.write('body { font-family: Arial, sans-serif; margin: 20px; }');
      newWindow.document.write('.header, .footer { display: flex; justify-content: space-between; align-items: center; }');
      newWindow.document.write('.header { margin-bottom: 20px; }');
      newWindow.document.write('.footer { margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }');
      newWindow.document.write('table { width: 100%; border-collapse: collapse; }');
      newWindow.document.write('th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }');
      newWindow.document.write('</style>');
      newWindow.document.write('</head><body>');
  
      // En-tête personnalisé
      newWindow.document.write('<div class="header">');
      newWindow.document.write('<div class="logo"><img src="assets/img/logo2.png" alt="Logo de la Société" style="height:50px;"></div>');
     

      newWindow.document.write('<div class="title"><h1>Panel De Fournisseurs</h1></div>');
      newWindow.document.write('<div class="date"><span>' + creationDate + '</span></div>');
      newWindow.document.write('</div>');
  
      // Contenu de la table
      newWindow.document.write(printContent);
  
      // Pied de page personnalisé
      newWindow.document.write('<div class="footer">');
      newWindow.document.write('<div class="emetteur">Emetteur</div>');
      newWindow.document.write('<div class="visa">VISA</div>');
      newWindow.document.write('</div>');
  
      newWindow.document.write('</body></html>');
      newWindow.document.close(); // Nécessaire pour Firefox
      newWindow.print(); // Lancer l'impression
    }
  }



}
