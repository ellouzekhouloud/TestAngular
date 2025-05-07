import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ControleProduitService } from 'src/app/services/controle-produit.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {
  controles: any[] = [];
  searchTerm = '';
   // Pagination
currentPage: number = 1;
itemsPerPage: number = 4;

showModal: boolean = false;
selectedControle: any = null;
  constructor( private http: HttpClient) {}

  ngOnInit(): void {
    this.loadControles();
  }

  loadControles(): void {
    this.http.get<any[]>('http://localhost:8080/api/controles/tous').subscribe(
      (data) => {
        this.controles = data;  // Assignation des données reçues à la variable controles
      },
      (error) => {
        console.error('Erreur lors de la récupération des contrôles', error);
      }
    );
  }
  

  get filteredControle() {
    return this.controles.filter(c => {
      const date = new Date(c.dateDeControle);
      const formattedDate = this.formatDate(date); // Fonction pour formater la date
      
      return (
        c.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        formattedDate.includes(this.searchTerm)||
        c.verificateur.toLowerCase().includes(this.searchTerm.toLowerCase()) 
      );
    });
  }
  
  // Fonction utilitaire pour formater la date comme "11-04-2025"
  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janvier = 0
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Méthode pour récupérer les BL de la page actuelle
  getPaginatedControle(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredControle.slice(startIndex, endIndex);
  }
  
  get totalPages(): number {
    return Math.ceil(this.filteredControle.length / this.itemsPerPage);
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

  openModal(controle: any): void {
    this.selectedControle = controle;
    this.showModal = true;
  }
  
  closeModal(): void {
    this.showModal = false;
    this.selectedControle = null;
  }
}
