import { Component, OnInit } from '@angular/core';
import { FicheDeRefus, FicheDeRefusService } from 'src/app/services/fiche-de-refus.service';

@Component({
  selector: 'app-liste-fiches-de-refus',
  templateUrl: './liste-fiches-de-refus.component.html',
  styleUrls: ['./liste-fiches-de-refus.component.css']
})
export class ListeFichesDeRefusComponent implements OnInit {
  fiches: FicheDeRefus[] = [];
  searchTerm = '';

  currentPage = 1;
  itemsPerPage = 5;

  constructor(private ficheService: FicheDeRefusService) {}

  ngOnInit(): void {
    this.ficheService.getAllFichesDeRefus().subscribe(data => {
      this.fiches = data;
    });
  }
  
get filteredFiches() {
  return this.fiches.filter(f => f.reference.toLowerCase().includes(this.searchTerm.toLowerCase()));
}


getPaginatedFiche(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredFiches.slice(startIndex, endIndex);
}

get totalPages(): number {
  return Math.ceil(this.filteredFiches.length / this.itemsPerPage);
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

}
