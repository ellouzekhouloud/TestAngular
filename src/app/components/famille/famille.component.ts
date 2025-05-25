import { Component, OnInit } from '@angular/core';
import { FamilleService, Famille } from 'src/app/services/famille.service';
import Swal from 'sweetalert2';

// IMPORTANT : il faut importer bootstrap JS dans ton angular.json ou index.html
// et utiliser la classe Modal de Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-famille',
  templateUrl: './famille.component.html',
  styleUrls: ['./famille.component.css']
})
export class FamilleComponent implements OnInit {
  familles: Famille[] = [];
  newFamille: Partial<Famille> = {};
  familleEnCours: Famille = { idFamille: 0, nomFamille: '' };

  private addModal: any;
  private editModal: any;

  constructor(private familleService: FamilleService) {}

  ngOnInit(): void {
    this.loadFamilles();

    // Initialiser les modals Bootstrap au démarrage
    const addModalElement = document.getElementById('addFamilleModal');
    if (addModalElement) {
      this.addModal = new bootstrap.Modal(addModalElement);
    }

    const editModalElement = document.getElementById('editFamilleModal');
    if (editModalElement) {
      this.editModal = new bootstrap.Modal(editModalElement);
    }
  }

  loadFamilles(): void {
    this.familleService.getAllFamilles().subscribe({
      next: data => this.familles = data,
      error: err => console.error('Erreur lors du chargement des familles', err)
    });
  }

  ouvrirModalAjout(): void {
    this.newFamille = {};
    this.addModal.show();
  }

  ajouterFamille(): void {
    if (!this.newFamille.nomFamille || this.newFamille.nomFamille.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Le nom de la famille est requis.'
      });
      return;
    }

    this.familleService.addFamille(this.newFamille).subscribe({
      next: () => {
        Swal.fire('Succès', 'Famille ajoutée avec succès.', 'success').then(() => {
          this.loadFamilles();
          this.addModal.hide();
        });
      },
      error: err => {
        console.error('Erreur ajout famille :', err);
        Swal.fire('Erreur', "Erreur lors de l'ajout de la famille.", 'error');
      }
    });
  }

  ouvrirModalModification(famille: Famille): void {
    this.familleEnCours = { ...famille };
    this.editModal.show();
  }

  modifierFamille(): void {
    if (!this.familleEnCours.nomFamille || this.familleEnCours.nomFamille.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Champ requis',
        text: 'Le nom de la famille est requis.'
      });
      return;
    }

    this.familleService.updateFamille(this.familleEnCours).subscribe({
      next: () => {
        Swal.fire('Modifié', 'Famille modifiée avec succès.', 'success').then(() => {
          this.loadFamilles();
          this.editModal.hide();
        });
      },
      error: err => {
        console.error('Erreur modification famille :', err);
        Swal.fire('Erreur', 'Une erreur est survenue lors de la modification.', 'error');
      }
    });
  }

  confirmerSuppression(id: number): void {
    Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Cette action est irréversible !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    }).then(result => {
      if (result.isConfirmed) {
        this.familleService.deleteFamille(id).subscribe(() => {
          this.loadFamilles();
          Swal.fire('Supprimé !', 'La famille a été supprimée avec succès.', 'success');
        });
      }
    });
  }
}
