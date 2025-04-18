import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLProduit, BlService } from 'src/app/services/bl.service';
import { ControleProduitService } from 'src/app/services/controle-produit.service';
import { EtiquetteVerteService } from 'src/app/services/etiquette-verte.service';
import { FicheDeRefusService } from 'src/app/services/fiche-de-refus.service';

import { ScanneService } from 'src/app/services/scanne.service';


@Component({
  selector: 'app-controle',
  templateUrl: './controle.component.html',
  styleUrls: ['./controle.component.css']
})
export class ControleComponent {
  idBL: number | undefined;
  referenceProduit: string = '';
  numBL: string | undefined;
  produit: any;
  plansDeControle: any[] = [];

  quantiteProduit: number | null = null;

  quantiteStatus: string = '';

  showValidationModal = false;
  showRefusModal = false;
  raisonRefus = '';

  verificateur: string = '';

  dateDeControle: string = '';

  produitsDuBL: any[] = [];
  produitsControles: string[] = [];
  produitsRestants: any[] = [];

  quantiteIncorrecte: number = 0;


  constructor(
    private route: ActivatedRoute,
    private blService: BlService, private scanneService: ScanneService, private controleProduitService: ControleProduitService,
    private router: Router,private ficheDeRefusService: FicheDeRefusService,private etiquetteService: EtiquetteVerteService
  ) {
    this.verificateur = this.getUtilisateurConnecte();
    this.dateDeControle = new Date().toISOString().split('T')[0];
  }


  getUtilisateurConnecte(): string {
    return localStorage.getItem('nom') ?? 'Utilisateur inconnu';
  }

  ngOnInit(): void {
    // Récupérer l'ID du BL depuis l'URL
    this.idBL = Number(this.route.snapshot.paramMap.get('id'));
    if (this.idBL) {
      // Appeler le service pour récupérer les informations du BL
      this.blService.getBlById(this.idBL).subscribe((blData) => {
        // Récupérer le numBL depuis les données retournées par l'API
        this.numBL = blData.numBL;
        this.produitsDuBL = blData.produits;



      });
    }

  }

  rechercherProduit(): void {
    if (this.referenceProduit) {
      this.scanneService.getProduitByReference(this.referenceProduit).subscribe((data) => {
        this.produit = data;

        // Récupérer le plan de contrôle
        this.scanneService.getPlanDeControleByReference(this.referenceProduit).subscribe((plan) => {
          this.plansDeControle = plan;
        });

        // Rechercher la quantité du produit dans la liste des produits du BL
        const produitDansBL = this.produitsDuBL.find(p => p.produit.reference === this.referenceProduit);

        if (produitDansBL) {
          this.quantiteProduit = produitDansBL.quantite;
        } else {
          this.quantiteProduit = null;
        }

      }, error => {
        console.error('Erreur lors de la récupération du produit:', error);
      });
    }
  }

  // Méthode pour valider la valeur mesurée par rapport à la tolérance
  validateValue(plan: any) {
    if (plan && plan.donneeTechnique && plan.tolerance && plan.valeurMesuree) {
      const valeurMesuree = parseFloat(plan.valeurMesuree);
      const valeurTechnique = parseFloat(plan.donneeTechnique);
      const toleranceStr = plan.tolerance.replace(/\s/g, '').replace('±', '').replace('+/-', '');
      const tolerance = parseFloat(toleranceStr);

      if (isNaN(valeurMesuree) || isNaN(valeurTechnique) || isNaN(tolerance)) {
        plan.isValid = null;
      } else {
        const valeurMin = valeurTechnique - tolerance;
        const valeurMax = valeurTechnique + tolerance;

        plan.isValid = valeurMesuree >= valeurMin && valeurMesuree <= valeurMax;
      }
    } else {
      plan.isValid = null;
    }
  }

  // Méthode pour valider le contrôle visuel
  validateVisuel(plan: any) {
    if (plan.visuel === 'Non Conforme') {
      plan.isVisuelValid = false;
    } else {
      plan.isVisuelValid = true;
    }
  }

  // Méthode pour gérer le changement de validation
  onValidationChange(status: string): void {
    this.quantiteStatus = status;
    console.log('Statut de la quantité:', this.quantiteStatus);
  }

  verifierEtAfficherModal() {
    if (this.quantiteStatus === 'invalid') {
      this.quantiteIncorrecte = 0;
      
    } else {
      this.raisonRefus = ''; // Réinitialise si ce n’est pas une non-conformité
    }
    let isAllValid = true;

    for (let plan of this.plansDeControle) {
      const isToleranceEmpty = !plan.tolerance || plan.tolerance.trim() === '-';

      // Cas Visuel obligatoire si tolérance vide
      if (isToleranceEmpty && plan.visuel !== 'Conforme') {
        isAllValid = false;
        
        break;
      }

      // Cas Valeur mesurée obligatoire si tolérance définie
      if (!isToleranceEmpty && plan.isValid !== true) {
        isAllValid = false;
        break;
      }
    }

    // Vérification de la validation de la quantité
    if (this.quantiteStatus !== 'valid') {
      isAllValid = false;
    }

    // Affichage du bon modal
    if (isAllValid) {
      this.showValidationModal = true;
    } else {
      this.showRefusModal = true;
     
    }
  }

  closeModal() {
    this.showValidationModal = false;
    this.showRefusModal = false;
  }

  // ✅ Méthode pour construire les données de contrôle
  buildControleData(avecRefus: boolean = false): any {
    const data: any = {
      reference: this.produit.reference,
      fournisseur: this.produit.fournisseur?.nomFournisseur,
      verificateur: this.verificateur,
      numBL: this.numBL,
      dateDeControle: this.dateDeControle,
      produit: { idProduit: this.produit.idProduit },
      quantite: this.quantiteProduit ? this.quantiteProduit : 0,
      quantiteStatus: this.quantiteStatus,
      resultatsControle: this.plansDeControle.map(plan => ({
        planDeControle: {
          id: plan.id
        },
        visuel: plan.isVisuelValid ? "Conforme" : "Non conforme",
        valeurMesuree: plan.valeurMesuree
      }))
    };
    

    if (avecRefus && this.raisonRefus) {
      data.raisonRefus = this.raisonRefus;
    }

    return data;
  }

  enregistrerControle() {
    const data = this.buildControleData(false);

    this.controleProduitService.enregistrerControle(data).subscribe({
      next: (response) => {
        console.log("Contrôle enregistré avec succès :", response);
        // 🔄 Mise à jour du champ is_controle
        this.controleProduitService.marquerProduitCommeControle(this.produit.reference).subscribe(() => {
          console.log("Produit marqué comme contrôlé");
        });
        window.alert("✅ Contrôle enregistré avec succès !");
        this.produitsControles.push(this.produit.reference);
        this.imprimerEtiquette();
        this.resetForm();
        this.passerAuProduitSuivant(); // 🔄
        this.closeModal();
       
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement du contrôle :", error);
      }
    });
  }

  enregistrerRefus() {
    const data = this.buildControleData(true);

    this.controleProduitService.enregistrerControle(data).subscribe({
      next: (response) => {
        console.log("Fiche de refus enregistrée :", response);
        window.alert("🚫 Fiche de refus enregistrée avec succès !");
        // 🔄 Mise à jour du champ is_controle
        this.controleProduitService.marquerProduitCommeControle(this.produit.reference).subscribe(() => {
          console.log("Produit marqué comme contrôlé");
        });
        this.produitsControles.push(this.produit.reference);
        this.printFicheDeRefus();
        this.imprimerFicheDeRefus();
        this.resetForm();
       
        this.passerAuProduitSuivant(); // 🔄
        this.closeModal();

        
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement de la fiche de refus :", error);
      }
    });
  }

  chargerProduitsDuBL() {
    this.controleProduitService.getProduitsDuBL(this.idBL!).subscribe((produits) => {
      this.produitsDuBL = produits;
      // Met à jour les produits restants avec ceux qui n'ont pas encore été contrôlés
      this.produitsRestants = produits.filter(p => !this.produitsControles.includes(p.reference));
    });
  }
  passerAuProduitSuivant() {
    this.produitsRestants = this.produitsRestants.filter(
      p => p.reference !== this.produit.reference
    );
  
    if (this.produitsRestants.length > 0) {
      // ✅ Décaler l'affichage pour éviter l'empilement
      setTimeout(() => {
        window.alert("ℹ️ Il reste encore des produits à contrôler.");
      }, 500); // attend 0.5s après "Contrôle enregistré"
      this.referenceProduit = this.produitsRestants[0].reference;
      this.rechercherProduit();
    } else {
      this.controleProduitService.verifierBLTermine(this.idBL!).subscribe(response => {
        if (response === true) {
          setTimeout(() => {
            window.alert("🎉 Tous les produits sont contrôlés, le BL est terminé !");
            this.router.navigate(['/ListBL']);
          }, 500);
        } else {
          setTimeout(() => {
            window.alert("⚠️ le BL n'est pas encore terminé, certains produits ne sont pas marqués.");
          }, 500);
        }
      });
    }
  }






  resetForm() {
    this.produit = null;
    this.referenceProduit = '';
    this.plansDeControle = [];
    this.quantiteProduit = 0;
    this.quantiteStatus = '';
    this.showValidationModal = false;
    this.showRefusModal = false;
    this.raisonRefus = '';
    this.quantiteIncorrecte= 0 ;
  }


  imprimerFicheDeRefus() {
    

    const ficheDeRefusData = {
      reference: this.produit.reference,
      fournisseur: this.produit.fournisseur?.nomFournisseur,
      verificateur: this.verificateur,
      numBL: this.numBL,
      dateDeControle: this.dateDeControle,
      motifRefus: 'Non Conforme', // Exemple de motif de refus
      raisonRefus : this.raisonRefus
      

    };
  
    // 1. Sauvegarder la fiche de refus dans la base
    this.ficheDeRefusService.saveFicheDeRefus(ficheDeRefusData).subscribe({
      next: (response) => {
        console.log('Fiche de Refus sauvegardée avec succès', response);
        this.printFicheDeRefus(); // 2. Imprimer la fiche
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde', error);
      }
    });
  }
  
  printFicheDeRefus() {
    //const nombreFiches = localStorage.getItem('nombreFichesDeRefus') || '0';  // 🔥 récupérer depuis localStorage

    const printContent = `
      <html>
      <head>
        <title>Fiche de Refus N° </title>

        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .ficheRefus { border: 2px solid black; padding: 10px; margin: 20px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="ficheRefus">
          <h2>Fiche de Refus N° </h2>
          <p><strong>Référence:</strong> ${this.produit.reference}</p>
          <p><strong>Fournisseur:</strong> ${this.produit.fournisseur?.nomFournisseur}</p>
          <p><strong>Vérificateur:</strong> ${this.verificateur}</p>
          <p><strong>Numéro BL:</strong> ${this.numBL}</p>
          <p><strong>Date de Contrôle:</strong> ${this.dateDeControle}</p>
          <p><strong>Motif de Refus:</strong> ❌ Non Conforme</p>
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;
  
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
    
  }

  
  
imprimerEtiquette() {
  const etiquetteData = {
    reference: this.produit.reference,
    fournisseur: this.produit.fournisseur?.nomFournisseur,
    verificateur: this.verificateur,
    numBL: this.numBL,
    dateDeControle: this.dateDeControle,
    resultat: 'Conforme'
  };

  // 1. Envoyer les données à la base
  this.etiquetteService.saveEtiquette(etiquetteData).subscribe({
    next: (response) => {
      console.log('Étiquette sauvegardée avec succès', response);
      this.printEtiquette(); // 2. Puis imprimer
    },
    error: (error) => {
      console.error('Erreur lors de la sauvegarde', error);
    }
  });
}

printEtiquette() {
  const printContent = `
    <html>
    <head>
      <title>Étiquette de Contrôle</title>
      <style>
        body { font-family: Arial, sans-serif; text-align: center; }
        .etiquette { border: 2px solid black; padding: 10px; margin: 20px; display: inline-block; 
        background-color: #28a745; /* Vert */
          color: white; /* Texte en blanc pour contraster */}
      </style>
    </head>
    <body>
      <div class="etiquette">
        <h2>Étiquette de Contrôle</h2>
        <p><strong>Numéro BL:</strong> ${this.numBL! +1}</p>
        <p><strong>Date de Contrôle:</strong> ${this.dateDeControle}</p>
        <p><strong>Vérificateur:</strong> ${this.verificateur}</p>
      </div>
      <script>window.print();</script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
  }
  
}
 

}
