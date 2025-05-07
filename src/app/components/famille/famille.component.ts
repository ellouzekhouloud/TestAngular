import { Component } from '@angular/core';
import { Famille, FamilleService } from 'src/app/services/famille.service';

@Component({
  selector: 'app-famille',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.css']
})
export class FamilleComponent {
  familles: Famille[] = [];
  newFamille: Partial<Famille> = {};


  constructor(private familleService: FamilleService) {}

  ngOnInit(): void {
    this.loadFamilles();
  }

  loadFamilles(): void {
    this.familleService.getAllFamilles().subscribe({
      next: (data) => this.familles = data,
      error: (err) => console.error('Erreur lors du chargement des familles', err)
    });
  }

  ajouterFamille(): void {
    if (!this.newFamille.nomFamille || this.newFamille.nomFamille.trim() === '') {
      alert("Le nom de la famille est requis.");
      return;
    }

    this.familleService.addFamille(this.newFamille).subscribe({
      next: (familleAjoutee) => {
        alert("Famille ajoutée avec succès.");
        this.newFamille = {}; 
        this.fermerModal();  
        this.loadFamilles(); 
      },
      error: (err) => {
        console.error('Erreur ajout famille :', err);
        alert("Erreur lors de l'ajout de la famille.");
      }
    });
  }

  fermerModal(): void {
    const modal = document.getElementById('addFamilleModal');
    if (modal) {
      (modal as any).classList.remove('show');
      (modal as any).style.display = 'none';
      document.body.classList.remove('modal-open');
      document.querySelector('.modal-backdrop')?.remove();
    }
  }
}
