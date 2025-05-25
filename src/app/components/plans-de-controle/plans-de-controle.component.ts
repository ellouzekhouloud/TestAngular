import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDeControleService } from 'src/app/services/plan-de-controle.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plans-de-controle',
  templateUrl: './plans-de-controle.component.html',
  styleUrls: ['./plans-de-controle.component.css']
})
export class PlansDeControleComponent {
  idProduit!: number;
  plans: any[] = [];
  planDeControleLignes: any[] = [
    { caracteristique: '', donneeTechnique: '', tolerance: '', frequenceEtTailleDePrelevement: '', moyenDeControle: '', methodeDeControle: '' }
  ];
  selectedPlan: any = {};  // Plan sélectionné pour modification
  isModalOpen: boolean = false;
  isModalModifyOpen: boolean = false; // Contrôle du modal de modification
  produit: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanDeControleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.produit = history.state.produit;
      this.idProduit = params['idProduit'];
      this.chargerPlansDeControle();
    });
  }

  chargerPlansDeControle() {
    this.planService.getPlansByProduit(this.idProduit).subscribe(data => {
      this.plans = data;
    });
  }

  openModal() {
    this.isModalOpen = true;
    document.body.classList.add('modal-open');
  }

  closeModal() {
    this.isModalOpen = false;
    this.resetLignes();
    document.body.classList.remove('modal-open');
  }

  openModifyModal(plan: any) {
    this.selectedPlan = { ...plan };  // Clone the selected plan to edit
    this.isModalModifyOpen = true;
  }

  closeModifyModal() {
    this.isModalModifyOpen = false;
    this.selectedPlan = {};  // Reset the selected plan
  }

  ajouterLigne() {
    this.planDeControleLignes.push({
      caracteristique: '', donneeTechnique: '', tolerance: '', frequenceEtTailleDePrelevement: '',
      moyenDeControle: '', methodeDeControle: ''
    });
  }

  supprimerLigne(index: number) {
    this.planDeControleLignes.splice(index, 1);
  }

  resetLignes() {
    this.planDeControleLignes = [
      { caracteristique: '', donneeTechnique: '', tolerance: '', frequenceEtTailleDePrelevement: '', moyenDeControle: '', methodeDeControle: '' }
    ];
  }

  enregistrerPlan() {
  // Vérifie si toutes les lignes sont correctement remplies
  const formulaireValide = this.planDeControleLignes.every(ligne =>
    ligne.caracteristique && ligne.donneeTechnique && ligne.tolerance &&
    ligne.frequenceEtTailleDePrelevement && ligne.moyenDeControle && ligne.methodeDeControle
  );

  if (!formulaireValide) {
    // ⚠️ SweetAlert si un champ est vide
    Swal.fire({
      icon: 'warning',
      title: 'Champs requis',
      text: 'Veuillez remplir tous les champs de chaque ligne avant de soumettre le plan.',
    });
    return;
  }

  // Tous les champs sont remplis
  const plan = {
    idProduit: this.idProduit,
    lignes: this.planDeControleLignes
  };

  this.planService.ajouterPlan(plan).subscribe(
    () => {
      // ✅ SweetAlert succès
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Plan de contrôle enregistré avec succès !',
        showConfirmButton: false,
        timer: 2000
      });

      this.closeModal();
      this.chargerPlansDeControle();
    },
    error => {
      // ❌ SweetAlert erreur
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'ajout du plan.',
      });
      console.error('Erreur lors de l\'ajout du plan:', error);
    }
  );
}


 modifierPlan() {
  this.planService.modifierPlan(this.selectedPlan).subscribe(
    () => {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Plan de contrôle modifié avec succès !',
        showConfirmButton: false,
        timer: 2000
      });

      this.closeModifyModal();
      this.chargerPlansDeControle();
    },
    error => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la modification du plan.',
      });
      console.error('Erreur lors de la modification du plan:', error);
    }
  );
}


  supprimerPlan(id: number) {
  Swal.fire({
    title: 'Confirmer la suppression',
    text: 'Êtes-vous sûr de vouloir supprimer ce plan ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.planService.supprimerPlan(id).subscribe(
        () => {
          Swal.fire({
            icon: 'success',
            title: 'Supprimé',
            text: 'Le plan a été supprimé avec succès.',
            showConfirmButton: false,
            timer: 2000
          });

          this.chargerPlansDeControle();
        },
        error => {
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la suppression du plan.',
          });
          console.error('Erreur lors de la suppression du plan:', error);
        }
      );
    }
  });
}


  goBack() {
    this.router.navigate(['/produits']);
  }

 
  
}

