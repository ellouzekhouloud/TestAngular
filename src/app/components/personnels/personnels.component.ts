import { Component, OnInit } from '@angular/core';
import { Personnel, PersonnelService } from 'src/app/services/personnel.service';

@Component({
  selector: 'app-personnels',
  templateUrl: './personnels.component.html',
  styleUrls: ['./personnels.component.css']
})
export class PersonnelsComponent implements OnInit {
  personnels: Personnel[] = [];
  selectedPersonnel: Personnel | null = null;

  constructor(private personnelService: PersonnelService) {}

  ngOnInit(): void {
    this.getPersonnels();
  }

  getPersonnels(): void {
    this.personnelService.getPersonnels().subscribe(data => {
      this.personnels = data;
    });
  }

  // Méthode pour afficher le formulaire d'édition d'un personnel
  editPersonnel(personnel: Personnel): void {
    this.selectedPersonnel = { ...personnel };  // Cloner l'objet pour éviter la modification directe
  }

  // Méthode pour enregistrer les modifications du personnel
  savePersonnel(): void {
    if (this.selectedPersonnel) {
      this.personnelService.updatePersonnel(this.selectedPersonnel.id, this.selectedPersonnel).subscribe(() => {
        // Remise à jour de la liste des personnels après modification
        this.getPersonnels();
        this.selectedPersonnel = null;  // Réinitialisation du formulaire
      });
    }
  }

  // Méthode pour supprimer un personnel
  deletePersonnel(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer ce personnel ?')) {
      this.personnelService.deletePersonnel(id).subscribe(() => {
        this.personnels = this.personnels.filter(p => p.id !== id);
      });
    }
  }
}
