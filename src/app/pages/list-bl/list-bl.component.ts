import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BL, BLProduit, BlService } from 'src/app/services/bl.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Fournisseur, Produit, ProduitService } from 'src/app/services/produit.service';

import Swal from 'sweetalert2';
declare var bootstrap: any;
@Component({
  selector: 'app-list-bl',
  templateUrl: './list-bl.component.html',
  styleUrls: ['./list-bl.component.css']
})
export class ListBlComponent {
  blList: any[] = [];
  filteredBL: any[] = [];
  searchQuery: string = '';
  selectedProduits: any[] = [];

  // Pagination
currentPage: number = 1;
itemsPerPage: number = 4;



  constructor(private http: HttpClient,private router: Router,
     private blService : BlService, 
  ) {
     const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { newBL?: any };

    if (state?.newBL) {
      this.blList.unshift(state.newBL);  // Ajout en début de liste
      this.filteredBL = [...this.blList];
    }
  }

 
// Méthode pour récupérer les BL de la page actuelle
getPaginatedBL(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredBL.slice(startIndex, endIndex);
}

get totalPages(): number {
  return Math.ceil(this.filteredBL.length / this.itemsPerPage);
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

openProduitModal(bl: any): void {
  this.selectedProduits = bl.produits;
}
  ngOnInit(): void {
     
    this.getBL();
  }

  
  getBL(): void {
    this.http.get<any[]>('http://localhost:8080/api/bl').subscribe(
      (data) => {
        this.blList = data.reverse(); // On inverse l'ordre pour avoir les plus récents en premier
      this.filteredBL = [...this.blList];
        // Vérification des données récupérées
       
  
        // Vérification que chaque BL a un ID
        this.blList.forEach(bl => {
         
        });
      },
      (error) => {
        console.error('Erreur lors de la récupération des BL:', error);
      }
    );
  }

  // ✅ Fixed: Now filters by 'fournisseur' (supplier)
  searchBL(): void {
    if (!this.searchQuery.trim()) {
      this.filteredBL = this.blList; // Réinitialisation si la recherche est vide
    } else {
      const query = this.searchQuery.toLowerCase();
  
      this.filteredBL = this.blList.filter(bl => {
        // Vérification du nom du fournisseur
        const nomFournisseurMatch = bl.fournisseur?.nomFournisseur?.toLowerCase().includes(query);
  
        // Vérification de la dateReception au format "Mar 25, 2025"
        const formattedDate = new Date(bl.dateReception).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric'
        });
  
        const dateReceptionMatch = formattedDate.toLowerCase().includes(query);
  
        return nomFournisseurMatch || dateReceptionMatch;
      });
    }
  }

  
  supprimerBL(idBL: number): void {
  

  if (idBL !== undefined && idBL !== null) {
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment supprimer ce BL ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`http://localhost:8080/api/bl/${idBL}`).subscribe(
          () => {
            this.blList = this.blList.filter(bl => bl.id !== idBL);
            this.filteredBL = this.filteredBL.filter(bl => bl.id !== idBL);

            Swal.fire({
              icon: 'success',
              title: 'Supprimé',
              text: 'Le bon de livraison a été supprimé avec succès.',
              timer: 2000,
              showConfirmButton: false
            });
          },
          (error) => {
           
            Swal.fire({
              icon: 'error',
              title: 'Erreur',
              text: 'Une erreur est survenue lors de la suppression.'
            });
          }
        );
      }
    });
  } else {
   
    Swal.fire({
      icon: 'error',
      title: "ID Introuvable",
      text: "Impossible de récupérer l'identifiant du BL."
    });
  }
}


  onUpdateList(updatedBL: any): void {
    this.blList = this.blList.map(bl =>
      bl.idBL === updatedBL.idBL ? updatedBL : bl
    );
    this.filteredBL = this.filteredBL.map(bl =>
      bl.idBL === updatedBL.idBL ? updatedBL : bl
    );

    // Close modal (adjust based on your HTML)
    const modal = document.getElementById('editBLModal');
    if (modal) {
      modal.classList.remove('show');
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
    }
  }
  demarrerControleEtNaviguer(blId: number): void {
   

  
      this.router.navigate(['/controler', blId]);
    }
    
  
}




