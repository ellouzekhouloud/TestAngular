import { Component } from '@angular/core';
import { Chart } from 'chart.js';
import { BLFicheDeRefusDTO, DashboardService } from 'src/app/services/dashboard.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Fournisseur } from 'src/app/services/produit.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  stats: any = {};
  produitsParFournisseur: any[] = [];
  produitsNonConformes: any[] = [];
  showDetails: boolean = false;

  startDate: string = '';
  endDate: string = '';
  showDatePicker: boolean = false;

  typePeriode: string = 'month';
  dateFiltre: string = '';
  chart: any;
  fournisseurs: string[] = [];
  quantitesReceptionnees: number[] = [];
  quantitesNonConformes: number[] = [];

  blsNonConformes: BLFicheDeRefusDTO[] = [];
  fournisseurBL: Fournisseur[] = [];

  fournisseur: string = '';
  date: string = '';
  paginatedBls: BLFicheDeRefusDTO[] = [];
  pageSize = 4;
  currentPage = 0;
  selectedPeriod: string = '';
  menuOpen: boolean = false;


  constructor(private dashboardService: DashboardService, private fournisseurService: FournisseurService) { }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe((data) => {
      this.stats = data;
      // 📌 Initialiser avec le mois et l'année courants
      const currentDate = new Date();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      this.dateFiltre = `${year}-${month}`;

      // 📌 Appliquer le filtre au démarrage
      this.applyFilter();
    });
    this.getBlsNonConformes();
    this.loadFournisseurs();
  }

  // ✅ Méthode pour ouvrir le modal
  openModal() {
    this.dashboardService.getProduitsParFournisseur().subscribe((data) => {
      this.produitsParFournisseur = data;
      const modal = document.getElementById('produitsModal');
      if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');

        // ✅ Ajouter manuellement le fond noir
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop fade show';
        backdrop.id = 'modalBackdrop';
        document.body.appendChild(backdrop);
      }
    });
  }


  // ✅ Méthode pour fermer le modal
  closeModal() {
    const modal = document.getElementById('produitsModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }

    // ✅ Supprimer le backdrop
    const backdrop = document.getElementById('modalBackdrop');
    if (backdrop) {
      document.body.removeChild(backdrop);
    }
  }


  // ✅ Afficher/Masquer le calendrier
  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  // ✅ Appliquer le filtre par date et ouvrir le modal
  applyDateFilter() {
    if (this.startDate && this.endDate) {
      this.selectedPeriod = `Période : du ${this.startDate} au ${this.endDate}`;
      this.openFournisseurModal();
    } else {
      alert('Veuillez sélectionner les deux dates.');
    }
  }

  // ✅ Ouvrir le modal avec les données
  openFournisseurModal() {
    this.dashboardService
      .getNonConformesParFournisseur(this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          console.log('Données récupérées :', data);
          this.produitsNonConformes = data;

          const modal = document.getElementById('fournisseursModal');
          if (modal) {
            modal.classList.add('show');
            modal.style.display = 'block';
            modal.removeAttribute('aria-hidden');
            modal.setAttribute('aria-modal', 'true');

            // ✅ Ajouter manuellement le fond noir
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.id = 'fournisseursBackdrop';
            document.body.appendChild(backdrop);
          }
        },
        error: (err) => {
          console.error('Erreur lors de la récupération :', err);
          alert('Une erreur est survenue lors de la récupération des données.');
        },
      });
  }


  // ✅ Fermer le modal
  closeFournisseurModal() {
    const modal = document.getElementById('fournisseursModal');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
      modal.removeAttribute('aria-modal');
    }

    const backdrop = document.getElementById('fournisseursBackdrop');
    if (backdrop) {
      document.body.removeChild(backdrop);
    }
  }

  exportToExcel(): void {
  const exportData = this.produitsNonConformes.map(item => ({
    Fournisseur: item.fournisseur,
    'Incidents (Non Conformes)': item.nonConformes,
    'Nombre de BL': item.nombreBL,
    'PPM': item.ppm
  }));

  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'NonConformes': worksheet },
    SheetNames: ['NonConformes']
  };

  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(data, `produits_non_conformes_${new Date().toISOString().slice(0,10)}.xlsx`);
}


  applyFilter() {
  if (!this.typePeriode) {
    alert('Veuillez sélectionner un type de période ou une période personnalisée.');
    return;
  }

  // Pour filtre personnalisé
  if (this.typePeriode === 'custom') {
    if (!this.startDate || !this.endDate) {
      alert('Veuillez sélectionner une période valide (date de début et de fin).');
      return;
    }

    this.dashboardService.getQuantitesParFournisseur(this.typePeriode, undefined, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.fournisseurs = data.map((item: any) => item.nomFournisseur);
          this.quantitesReceptionnees = data.map((item: any) => item.quantiteReceptionnee);
          this.quantitesNonConformes = data.map((item: any) => item.quantiteNonConforme);
        },
        error: (err) => {
          alert('Erreur lors de la récupération des données.');
          console.error(err);
        }
      });
    return;
  }

  // Pour les autres filtres standard (mois, trimestre, semestre, année)
  if (!this.dateFiltre) {
    alert('Veuillez sélectionner une date.');
    return;
  }

  let formattedDate = this.dateFiltre;

  switch (this.typePeriode) {
    case 'month':
      formattedDate = formattedDate + '-01';
      break;
    case 'quarter': {
      const month = parseInt(formattedDate.split('-')[1]);
      const quarterStartMonth = Math.floor((month - 1) / 3) * 3 + 1;
      formattedDate = formattedDate.split('-')[0] + `-${String(quarterStartMonth).padStart(2, '0')}-01`;
      break;
    }
    case 'semester': {
      const month = parseInt(formattedDate.split('-')[1]);
      const semesterStartMonth = month <= 6 ? '01' : '07';
      formattedDate = formattedDate.split('-')[0] + `-${semesterStartMonth}-01`;
      break;
    }
    case 'year':
      formattedDate = formattedDate.split('-')[0] + '-01-01';
      break;
    default:
      alert('Type de filtre non valide !');
      return;
  }

  this.dashboardService.getQuantitesParFournisseur(this.typePeriode, formattedDate).subscribe({
    next: (data) => {
      this.fournisseurs = data.map((item: any) => item.nomFournisseur);
      this.quantitesReceptionnees = data.map((item: any) => item.quantiteReceptionnee);
      this.quantitesNonConformes = data.map((item: any) => item.quantiteNonConforme);
    },
    error: (err) => {
      alert('Erreur lors de la récupération des données.');
      console.error(err);
    }
  });
}


  getBlsNonConformes(): void {
    this.dashboardService.getBLNonConformes(this.fournisseur, this.date).subscribe((data) => {
      this.blsNonConformes = data;
      this.updatePagination();
    });
  }

  updatePagination(): void {
    const start = this.currentPage * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedBls = this.blsNonConformes.slice(start, end);
  }

  nextPage(): void {
    if ((this.currentPage + 1) * this.pageSize < this.blsNonConformes.length) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  loadFournisseurs(): void {
    this.fournisseurService.getFournisseurs().subscribe((data) => {
      this.fournisseurBL = data;
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    if (this.fournisseur || this.date) {
      this.dashboardService.getBLNonConformes().subscribe((data) => {
        this.blsNonConformes = data.filter(bl =>
          (!this.fournisseur || bl.fournisseur.includes(this.fournisseur)) &&
          (!this.date || bl.dateDeControle === this.date)
        );
        this.updatePagination();
      });
    } else {
      this.getBlsNonConformes();
    }
  }

  clearFilters(): void {
    this.fournisseur = '';
    this.date = '';
    this.currentPage = 0;
    this.getBlsNonConformes();
  }
toggleMenu(): void {
  this.menuOpen = !this.menuOpen;
}
downloadExcel(): void {
  const worksheet = XLSX.utils.json_to_sheet(this.blsNonConformes);
  const workbook = { Sheets: { 'BLs Non Conformes': worksheet }, SheetNames: ['BLs Non Conformes'] };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  FileSaver.saveAs(blob, 'bls-non-conformes.xlsx');
}

}
