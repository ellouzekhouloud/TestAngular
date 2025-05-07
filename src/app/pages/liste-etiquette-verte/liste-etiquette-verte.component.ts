import { Component, OnInit } from '@angular/core';
import { Etiquette, EtiquetteVerteService } from 'src/app/services/etiquette-verte.service';

@Component({
  selector: 'app-liste-etiquette-verte',
  templateUrl: './liste-etiquette-verte.component.html',
  styleUrls: ['./liste-etiquette-verte.component.css']
})
export class ListeEtiquetteVerteComponent implements OnInit {
etiquettes: Etiquette[] = [];
  searchTerm = '';

currentPage = 1;
itemsPerPage = 4;

  constructor(private EtiquetteService: EtiquetteVerteService) {}

  ngOnInit(): void {
    this.EtiquetteService.getAllEtiquettes().subscribe(data => {
      this.etiquettes = data;
    });
  }
  
get filteredEtiquette() {
  return this.etiquettes.filter(e => e.reference.toLowerCase().includes(this.searchTerm.toLowerCase()));
}


getPaginatedEtiquette(): any[] {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.filteredEtiquette.slice(startIndex, endIndex);
}

get totalPages(): number {
  return Math.ceil(this.filteredEtiquette.length / this.itemsPerPage);
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
