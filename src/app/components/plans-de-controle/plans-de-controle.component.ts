import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlanDeControleService } from 'src/app/services/plan-de-controle.service';

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
  isModalOpen: boolean = false; // Initialisation à false par défaut

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private planService: PlanDeControleService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
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
    console.log("Ouverture du modal");
    this.isModalOpen = true;  // Ouvrir le modal
  }

  closeModal() {
    console.log("Fermeture du modal");
    this.isModalOpen = false;
    this.resetLignes();
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
    const plan = {
      idProduit: this.idProduit, 
      lignes: this.planDeControleLignes 
    };
    
    console.log('Données envoyées au backend:', plan);
    
    this.planService.ajouterPlan(plan).subscribe(
      () => {
        this.closeModal(); 
        this.chargerPlansDeControle(); 
      },
      error => {
        console.error('Erreur lors de l\'ajout du plan:', error);
      }
    );
  }
  modifierPlan(plan: any) {
    console.log("Modification du plan", plan);
    // Copie du plan à modifier dans les lignes du plan de contrôle
    this.planDeControleLignes = [...plan.lignes];  // Assure-toi que "plan.lignes" contient les données à modifier
    this.isModalOpen = true; // Ouvre le modal
}

supprimerPlan(id: number) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce plan ?")) {
      this.planService.supprimerPlan(id).subscribe(
          () => {
              console.log("Plan supprimé avec succès");
              this.chargerPlansDeControle(); // Recharger la liste des plans après suppression
          },
          error => {
              console.error("Erreur lors de la suppression du plan", error);
          }
      );
  }
}
  
  goBack() {
    this.router.navigate(['/produits']); 
  }
}
