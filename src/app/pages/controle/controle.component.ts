import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BLProduit, BlService } from 'src/app/services/bl.service';

import { ControleProduitService } from 'src/app/services/controle-produit.service';
import { EtiquetteVerteService } from 'src/app/services/etiquette-verte.service';
import { FicheDeRefusService } from 'src/app/services/fiche-de-refus.service';
import { Produit } from 'src/app/services/produit.service';

import { ScanneService } from 'src/app/services/scanne.service';
import Swal from 'sweetalert2';


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
    private router: Router, private ficheDeRefusService: FicheDeRefusService, private etiquetteService: EtiquetteVerteService,
    private http: HttpClient,

  ) {
    this.verificateur = this.getUtilisateurConnecte();
    this.dateDeControle = new Date().toISOString().split('T')[0];
  }


  getUtilisateurConnecte(): string {
    return (
      localStorage.getItem('nom') ||
      sessionStorage.getItem('nom') ||
      'Utilisateur inconnu'
    );
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

        // Appeler le service pour récupérer les produits contrôlés
        this.controleProduitService.getProduitsControles(this.idBL!).subscribe(
          (produits) => {
            this.produitsControles = produits;
          },
          (error) => {
            console.error('Erreur lors de la récupération des produits contrôlés:', error);
          }
        );

      });
    }

  }

  rechercherProduit(): void {

    if (this.referenceProduit) {
      // ✅ Vérifie si ce produit est déjà contrôlé
      if (this.produitsControles.includes(this.referenceProduit)) {
        window.alert("⚠️ Ce produit a déjà été contrôlé !");
        return; // ⛔ Stop ici, on ne fait pas de requêtes inutiles
      }

      this.scanneService.getProduitByReference(this.referenceProduit).subscribe((data) => {
        this.produit = data;
        console.log("Produit récupéré :", this.produit); // ⬅️ Vérifie que `moq` est bien là
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
      quantiteIncorrecte: this.quantiteIncorrecte ? this.quantiteIncorrecte : 0,
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

        // ✅ Affichage SweetAlert2
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: '✅ Contrôle enregistré avec succès !',
          confirmButtonText: 'OK'
        });

        this.produitsControles.push(this.produit.reference);
        this.imprimerEtiquette();
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement du contrôle :", error);

        // ❌ Affichage erreur SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur est survenue lors de l'enregistrement du contrôle.",
          confirmButtonText: 'Fermer'
        });
      }
    });
  }


  enregistrerRefus() {
    const data = this.buildControleData(true);

    this.controleProduitService.enregistrerControle(data).subscribe({
      next: (response) => {
        console.log("Fiche de refus enregistrée :", response);

        // ✅ Affichage SweetAlert2
        Swal.fire({
          icon: 'warning',
          title: 'Fiche de refus',
          text: '🚫 Fiche de refus enregistrée avec succès !',
          confirmButtonText: 'OK'
        });

        // 🔄 Mise à jour du champ is_controle
        this.controleProduitService.marquerProduitCommeControle(this.produit.reference).subscribe(() => {
          console.log("Produit marqué comme contrôlé");
        });

        this.produitsControles.push(this.produit.reference);

        this.imprimerFicheDeRefus();
      },
      error: (error) => {
        console.error("Erreur lors de l'enregistrement de la fiche de refus :", error);

        // ❌ Affichage erreur SweetAlert2
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur est survenue lors de l'enregistrement de la fiche de refus.",
          confirmButtonText: 'Fermer'
        });
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
        Swal.fire({
          icon: 'info',
          title: 'Produits restants',
          text: 'ℹ️ Il reste encore des produits à contrôler.',
          confirmButtonText: 'OK',
          timer: 2500, // 2.5 secondes
          timerProgressBar: true
        });
      }, 500);

      this.referenceProduit = this.produitsRestants[0].reference;
      this.rechercherProduit();
    } else {
      this.controleProduitService.verifierBLTermine(this.idBL!).subscribe(response => {
        if (response === true) {
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'BL terminé',
              text: '🎉 Tous les produits sont contrôlés, le BL est terminé !',
              confirmButtonText: 'Retour à la liste',

            }).then(() => {
              this.router.navigate(['/ListBL']);
            });
          }, 500);
        } else {
          setTimeout(() => {
            Swal.fire({
              icon: 'warning',
              title: 'BL incomplet',
              text: '⚠️ Le BL n\'est pas encore terminé, certains produits ne sont pas contrôlés.',
              confirmButtonText: 'OK',
              timer: 2500, // 2.5 secondes
              timerProgressBar: true
            });
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
    this.quantiteIncorrecte = 0;
  }


  imprimerFicheDeRefus() {
    const printWindow = window.open('', '_blank', 'width=800,height=600');

    const ficheDeRefusData = {
      reference: this.produit.reference,
      fournisseur: this.produit.fournisseur?.nomFournisseur,
      verificateur: this.verificateur,
      numBL: this.numBL,
      dateDeControle: this.dateDeControle,
      motifRefus: 'Non Conforme',
      raison: this.raisonRefus,
      quantiteIncorrecte: this.quantiteIncorrecte,
      quantiteProduit: this.quantiteProduit,
      quantiteStatus: this.quantiteStatus
    };
    const etiquetteData = {
      reference: this.produit.reference,
      fournisseur: this.produit.fournisseur?.nomFournisseur,
      verificateur: this.verificateur,
      numBL: this.numBL,
      dateDeControle: this.dateDeControle,
      resultat: 'Conforme'
    };

    this.ficheDeRefusService.saveFicheDeRefus(ficheDeRefusData).subscribe({
      next: (response) => {
        console.log('Fiche de Refus sauvegardée avec succès', response);
        const numero = response.numeroFiche;
        this.remplirContenuEtImprimer(printWindow, numero, ficheDeRefusData);

        // ✅ Déplacer le reset ICI après impression
        this.resetForm();
        this.passerAuProduitSuivant();
        this.closeModal();
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde', error);
        if (printWindow) {
          printWindow.close();
        }
      }
    });
    this.etiquetteService.saveEtiquette(etiquetteData).subscribe({
      next: (response) => {
        // 3. Une fois sauvegardée, imprimer


      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde', error);
      }
    });
  }

  remplirContenuEtImprimer(printWindow: Window | null, numero: number, data: any) {
    const moq = this.produit?.moq;
    const quantite = this.quantiteProduit;
    const quantiteIncorrecte = this.quantiteIncorrecte;

    if (moq == null || quantite == null || moq <= 0 || quantite <= 0) {
      console.error('MOQ ou quantité non définie ou invalide', { moq, quantite });
      return;
    }

    const nombreFiches = Math.floor((quantite - quantiteIncorrecte) / moq);
    const nombreEtiquettesRestantes = Math.ceil(quantiteIncorrecte / moq);


    if (!printWindow) return;

    const quantiteNonConforme = data.quantiteStatus === 'invalid'
      ? `<p><strong>Quantité non conforme :</strong> ${data.quantiteIncorrecte} au lieu de ${data.quantiteProduit}</p>`
      : '';

    let printContent = `
      <html>
      <head>
        <title>Impression</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
  
          .ficheRefus { 
            border: 2px solid black; 
            padding: 20px; 
            margin: 50px auto; 
            width: 80%; 
            box-shadow: 0 0 10px rgba(0,0,0,0.1); 
            page-break-after: always;
          }
          .etiquette { 
            border: 2px solid black; 
            padding: 10px; 
            margin: 20px auto; 
            display: inline-block; 
            background-color: #28a745;
            color: white;
            width: 300px;
            height: 200px;
            page-break-after: always;
          }
  
          h2 { color: white; }
        </style>
      </head>
      <body>
    `;

    // Fiches de refus
    for (let i = 1; i <= nombreFiches; i++) {
      printContent += `
        <div class="ficheRefus">
          <h2>Fiche de Refus N° ${numero}</h2>
          <p><strong>Référence :</strong> ${data.reference}</p>
          <p><strong>Fournisseur :</strong> ${data.fournisseur}</p>
          <p><strong>Vérificateur :</strong> ${data.verificateur}</p>
          <p><strong>Numéro BL :</strong> ${data.numBL}</p>
          <p><strong>Date de Contrôle :</strong> ${data.dateDeControle}</p>
          <p><strong>Motif de Refus :</strong> ❌ ${data.motifRefus}</p>
          <p><strong>Raison :</strong> ${data.raison}</p>
          ${quantiteNonConforme}
        </div>
      `;
    }

    // Étiquettes conformes restantes
    for (let i = 1; i <= nombreEtiquettesRestantes; i++) {
      printContent += `
        <div class="etiquette">
          <h2>✅ Étiquette de Contrôle</h2>
          <p><strong>Numéro BL:</strong> ${this.numBL}</p>
          <p><strong>Date de Contrôle:</strong> ${this.dateDeControle}</p>
          <p><strong>Vérificateur:</strong> ${this.verificateur}</p>
        </div>
      `;
    }

    printContent += `
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  }


  imprimerEtiquette() {
    // 1. Ouvre la fenêtre d'impression IMMÉDIATEMENT pour éviter le blocage navigateur
    const printWindow = window.open('', '', 'width=800,height=600');

    const etiquetteData = {
      reference: this.produit.reference,
      fournisseur: this.produit.fournisseur?.nomFournisseur,
      verificateur: this.verificateur,
      numBL: this.numBL,
      dateDeControle: this.dateDeControle,
      resultat: 'Conforme'
    };

    // 2. Sauvegarde dans la base
    this.etiquetteService.saveEtiquette(etiquetteData).subscribe({
      next: (response) => {
        console.log('Étiquette sauvegardée avec succès', response);
        // 3. Une fois sauvegardée, imprimer

        this.printEtiquette(printWindow); // 👈 envoie la fenêtre déjà ouverte
        this.resetForm();
        this.passerAuProduitSuivant();
        this.closeModal();
      },
      error: (error) => {
        console.error('Erreur lors de la sauvegarde', error);
      }
    });
  }

  printEtiquette(printWindow: Window | null) {
    const moq = this.produit?.moq;
    const quantite = this.quantiteProduit;

    if (moq == null || quantite == null || moq <= 0 || quantite <= 0) {
      console.error('MOQ ou quantité non définie ou invalide', { moq, quantite });
      return;
    }

    const nombreEtiquettes = Math.ceil(quantite / moq);

    let printContent = `
      <html>
      <head>
        <title>Étiquette de Contrôle</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; }
          .etiquette { 
            border: 2px solid black; 
            padding: 10px; 
            margin: 20px; 
            display: inline-block; 
            background-color: #28a745;
            color: white;
            width: 300px;
            height: 200px;
          }
        </style>
      </head>
      <body>
    `;

    for (let i = 1; i <= nombreEtiquettes; i++) {
      printContent += `
        <div class="etiquette">
          <h2>✅ Étiquette de Contrôle</h2>
          <p><strong>Numéro BL:</strong> ${this.numBL}</p>
          <p><strong>Date de Contrôle:</strong> ${this.dateDeControle}</p>
          <p><strong>Vérificateur:</strong> ${this.verificateur}</p>
        </div>
      `;
    }

    printContent += `
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            window.close();
          };
        </script>
      </body>
      </html>
    `;

    // Remplir la fenêtre ouverte plus tôt
    if (printWindow) {
      printWindow.document.open(); // s'assurer que c’est prêt
      printWindow.document.write(printContent);
      printWindow.document.close();
    }
  }


}
