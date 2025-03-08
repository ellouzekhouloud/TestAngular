import { FournisseurService } from '../../services/fournisseur.service';
import { Component, OnInit } from '@angular/core';
import { Fournisseur } from '../../services/fournisseur.service';

@Component({
  selector: 'app-fournisseurs',
  templateUrl: './fournisseurs.component.html',
  styleUrls: ['./fournisseurs.component.css']
})
export class FournisseursComponent implements OnInit {
  fournisseurs: Fournisseur[] = [];

  constructor(private FournisseurService: FournisseurService) {}

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
}
