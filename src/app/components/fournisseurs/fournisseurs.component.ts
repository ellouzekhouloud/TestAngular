import { FournisseurService } from '../../services/fournisseur.service';
import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../../services/fournisseur.service';
import { Produit, ProduitService } from 'src/app/services/produit.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];
  editFournisseurForm: FormGroup;
  selectedFournisseurId: number | null = null;

  constructor(private FournisseurService: FournisseurService,private ProduitService: ProduitService,private fb: FormBuilder) {
    this.editFournisseurForm = this.fb.group({
      nomFournisseur: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]
    });
  }

  ngOnInit(): void {
    this.getFournisseurs();
  }

  getFournisseurs(): void {
    this.FournisseurService.getFournisseurs().subscribe(data => {
      this.fournisseurs = data;
    });
  }

  deleteFournisseur(id: number): void {
    if (confirm('Voulez-vous supprimer ce fournisseur ?')) {
      this.FournisseurService.deleteFournisseur(id).subscribe(() => {
        this.fournisseurs = this.fournisseurs.filter(f => f.idFournisseur !== id);
      });
    }
  }

  // Ouvrir le modal et remplir le formulaire avec les données du fournisseur
  openEditModal(fournisseur: Fournisseur): void {
    this.selectedFournisseurId = fournisseur.idFournisseur;
    this.editFournisseurForm.setValue({
      nomFournisseur: fournisseur.nomFournisseur,
      email: fournisseur.email,
      adresse: fournisseur.adresse,
      telephone: fournisseur.telephone
    });
  }

  // Enregistrer les modifications
  onUpdateFournisseur(): void {
    if (this.selectedFournisseurId && this.editFournisseurForm.valid) {
      this.FournisseurService.updateFournisseur(this.selectedFournisseurId, this.editFournisseurForm.value)
        .subscribe(updatedFournisseur => {
          // Mise à jour de la liste des fournisseurs
          this.fournisseurs = this.fournisseurs.map(f =>
            f.idFournisseur === this.selectedFournisseurId ? updatedFournisseur : f
          );

          // Fermer le modal
          document.getElementById('editFournisseurModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.querySelector('.modal-backdrop')?.remove();
        });
    }
  }
  
}
