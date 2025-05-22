import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/services/dashboard.service';
import { FournisseurService } from 'src/app/services/fournisseur.service';
import { Fournisseur } from 'src/app/services/produit.service';

@Component({
  selector: 'app-dashboard-ppm',
  templateUrl: './dashboard-ppm.component.html',
  styleUrls: ['./dashboard-ppm.component.css']
})
export class DashboardPPmComponent implements OnInit {
fournisseurs: Fournisseur[] = [];
  selectedFournisseur = '';
  ppm: number | null = null;

  constructor(private  fournisseurService : FournisseurService, private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.fournisseurService.getFournisseurs().subscribe({
      next: (data) => this.fournisseurs = data,
      error: (err) => console.error('Erreur chargement fournisseurs', err)
    });
  }

  onFournisseurChange(): void {
    if (this.selectedFournisseur) {
      this.dashboardService.getPPM(this.selectedFournisseur).subscribe({
        next: (data) => this.ppm = data,
        error: (err) => {
          console.error('Erreur chargement PPM', err);
          this.ppm = null;
        }
      });
    } else {
      this.ppm = null;
    }
  }
}
