import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ChargeTrackerService } from 'src/app/services/charge-tracker.service';
import { ChargeService } from 'src/app/services/charge.service';

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

  constructor(private http: HttpClient,private router: Router,private chargeService: ChargeService,
    private chargeTracker: ChargeTrackerService,
  ) {}

 
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
        this.blList = data;
        this.filteredBL = data; // Initialize filtered list
  
        // Vérification des données récupérées
        console.log('Liste des BL récupérés:', this.blList);
  
        // Vérification que chaque BL a un ID
        this.blList.forEach(bl => {
          console.log('BL ID:', bl.id); // Assurez-vous que l'ID est bien présent
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

  // ✅ Fixed: Delete by 'idBL' (not 'numBL')
  supprimerBL(idBL: number): void {
    // Vérifie si l'ID est bien défini
    if (idBL !== undefined && idBL !== null) {
      console.log("Suppression du BL avec l'ID:", idBL);
      if (confirm('Voulez-vous vraiment supprimer ce BL ?')) {
        this.http.delete(`http://localhost:8080/api/bl/${idBL}`).subscribe(
          () => {
            // Mettre à jour la liste après suppression
            this.blList = this.blList.filter(bl => bl.id !== idBL);
            this.filteredBL = this.filteredBL.filter(bl => bl.id !== idBL);
            alert('BL supprimé avec succès !');
          },
          (error) => {
            console.error('Erreur lors de la suppression du BL:', error);
            alert('Erreur lors de la suppression.');
          }
        );
      }
    } else {
      console.error("L'ID du BL est undefined");
      alert("L'ID du BL est introuvable.");
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
    const personnelId = this.chargeTracker.getPersonnelId();

  if (!personnelId) {
    alert("Aucun ID personnel trouvé !");
    return;
  }

  this.chargeService.demarrerControle(personnelId, blId).subscribe({
    next: (res) => {
      console.log("✅ Contrôle démarré :", res);
      this.chargeTracker.setChargeId(res.id);  // Enregistrer l’ID de charge
      this.router.navigate(['/controler', blId]);
    },
    error: (err) => {
      console.error("❌ Erreur au démarrage du contrôle :", err);
      alert("Erreur lors du démarrage du contrôle.");
    }
  });

}}
