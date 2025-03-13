import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PersonnelService } from 'src/app/services/personnel.service';

@Component({
  selector: 'app-add-personnel',
  templateUrl: './add-personnel.component.html',
  styleUrls: ['./add-personnel.component.css']
})
export class AddPersonnelComponent {
  personnelForm: FormGroup;
  successMessage: string = ''; // Message de succès
  errorMessage: string = ''; // Message d'erreur

  constructor(private fb: FormBuilder, private personnelService: PersonnelService, private router: Router) {
    this.personnelForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      adresse: ['', Validators.required],
      telephone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      poste: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.personnelForm.valid) {
      this.personnelService.addPersonnel(this.personnelForm.value).subscribe(
        response => {
          // Succès : Afficher un message et rediriger l'utilisateur
          this.successMessage = 'Personnel ajouté avec succès !';
          this.errorMessage = ''; // Réinitialiser l'erreur

          // Vous pouvez également rediriger l'utilisateur vers la page des personnels si nécessaire
          // this.router.navigate(['/personnels']); 
          
          this.personnelForm.reset();  // Réinitialiser le formulaire après ajout
        },
        error => {
          // Erreur : Afficher un message d'erreur
          this.errorMessage = 'Erreur lors de l’ajout du personnel';
          this.successMessage = ''; // Réinitialiser le message de succès
        }
      );
    } else {
      this.errorMessage = 'Formulaire invalide';
      this.successMessage = ''; // Réinitialiser le message de succès
    }
  }
}
