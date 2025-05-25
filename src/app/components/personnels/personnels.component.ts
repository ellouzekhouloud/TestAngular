
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Personnel, PersonnelService } from 'src/app/services/personnel.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-personnels',
  templateUrl: './personnels.component.html',
  styleUrls: ['./personnels.component.css']
})
export class PersonnelsComponent implements OnInit {
  personnels: Personnel[] = [];
  selectedPersonnel: Personnel | null = null;
  editPersonnelForm: FormGroup;
  selectedPersonnelId: number | null = null;
  personnelForm!: FormGroup;
  showPassword = false;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 4;


  passwordFocused: boolean = false;

  constructor(private personnelService: PersonnelService, private fb: FormBuilder) {

    this.personnelForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[A-Z])(?=.*\\d).{8,}$')
      ]],
      matricule: ['', Validators.required],
      qualifications: ['', Validators.required],
      role: ['', Validators.required]
    });


    this.editPersonnelForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      matricule: ['', Validators.required],
      qualifications: ['', Validators.required],

      motDePasse: [{ value: '', disabled: true }], // Désactivé ici
      role: [{ value: '', disabled: true }]
    });
  }

  ngAfterViewInit(): void {
    const modalElement = document.getElementById('addPersonnelModal');
    if (modalElement) {
      modalElement.addEventListener('hidden.bs.modal', () => {
        this.personnelForm.reset();
      });
    }
  }

  getPaginatedPersonnel(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.personnels.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.personnels.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }

  }
  paginationPages(): number[] {
    const pages: number[] = [];
    const start = Math.max(2, this.currentPage - 1);
    const end = Math.min(this.totalPages - 1, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      if (this.getPaginatedPersonnel().length > 0) {
        pages.push(i);
      }
    }

    return pages;
  }

  ngOnInit(): void {
    this.getPersonnels();
  }

  getPersonnels(): void {
    this.personnelService.getPersonnels().subscribe(data => {
      this.personnels = data;
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
  if (this.personnelForm.valid) {
    const personnelData = this.personnelForm.value;

    const fileContent = `
Nom: ${personnelData.nom}
Prénom: ${personnelData.prenom}
Matricule: ${personnelData.matricule}
Qualifications: ${personnelData.qualifications}
Email: ${personnelData.email}
Mot de Passe: ${personnelData.motDePasse}
Rôle: ${personnelData.role}
    `;

    const saveFile = async () => {
      try {
        const fileHandle = await (window as any).showSaveFilePicker({
          suggestedName: `Personnel_${personnelData.nom}_${personnelData.prenom}.txt`,
          types: [
            {
              description: 'Fichier texte',
              accept: { 'text/plain': ['.txt'] },
            },
          ],
        });

        const writable = await fileHandle.createWritable();
        await writable.write(fileContent);
        await writable.close();

        Swal.fire({
          icon: 'success',
          title: 'Fichier enregistré',
          text: 'Le fichier a été enregistré avec succès !',
        });
      } catch (err) {
        console.error("Erreur lors de l'enregistrement", err);
        Swal.fire({
          icon: 'error',
          title: 'Annulé',
          text: "L'enregistrement a été annulé ou une erreur est survenue.",
        });
      }
    };

    saveFile();

    this.personnelService.addPersonnel(personnelData).subscribe(
      response => {
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Personnel ajouté avec succès !',
        });

        this.personnelForm.reset();
        this.getPersonnels();

        setTimeout(() => {
          const closeBtn = document.getElementById('closeModalBtn') as HTMLElement;
          if (closeBtn) closeBtn.click();
        }, 100);
      },
      error => {
        console.error('Erreur lors de l’ajout du personnel', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Une erreur est survenue lors de l’ajout !',
        });
      }
    );
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Champs incomplets',
      text: 'Veuillez remplir tous les champs obligatoires !',
    });
  }
}




  // Ouvrir le modal et remplir le formulaire avec les données du fournisseur
  openEditModal(personnel: Personnel): void {
    this.selectedPersonnelId = personnel.id;
    this.editPersonnelForm.setValue({
      nom: personnel.nom,
      prenom: personnel.prenom,
      email: personnel.email,
      matricule: personnel.matricule,
      qualifications: personnel.qualifications,

      role: personnel.role,
      motDePasse: ''  // On initialise le mot de passe à vide (si l'utilisateur le change, il le remplit)
    });
    this.editPersonnelForm.get('motDePasse')?.disable();
    this.editPersonnelForm.get('role')?.disable();
  }

  // Enregistrer les modifications
  onUpdatePersonnel(): void {
  if (this.selectedPersonnelId && this.editPersonnelForm.valid) {

    const formValues = this.editPersonnelForm.value;

    // Ne pas inclure le mot de passe vide dans la mise à jour
    if (!formValues.motDePasse) {
      delete formValues.motDePasse;
    }

    // ✅ Confirmation avant mise à jour
    Swal.fire({
      title: 'Confirmation',
      text: 'Voulez-vous vraiment enregistrer les modifications ?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler'
    }).then((result) => {
      if (result.isConfirmed) {
        this.personnelService.updatePersonnel(this.selectedPersonnelId!, formValues)
          .subscribe(
            updatePersonnel => {
              // ✅ Mise à jour de la liste
              this.personnels = this.personnels.map(p =>
                p.id === this.selectedPersonnelId ? updatePersonnel : p
              );

              // ✅ Fermer le modal
              document.getElementById('editPersonnelModal')?.classList.remove('show');
              document.body.classList.remove('modal-open');
              document.querySelector('.modal-backdrop')?.remove();

              // ✅ Message de succès
              Swal.fire({
                icon: 'success',
                title: 'Modifications enregistrées',
                text: 'Le personnel a été modifié avec succès.',
              });
            },
            error => {
              console.error("Erreur lors de la mise à jour :", error);
              Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: 'Erreur lors de la modification du personnel.',
              });
            }
          );
      }
    });
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Formulaire invalide',
      text: 'Veuillez remplir correctement tous les champs.',
    });
  }
}
  deactivatePersonnel(id: number) {
  Swal.fire({
    title: 'Confirmation',
    text: 'Voulez-vous vraiment désactiver ce personnel ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, désactiver',
    cancelButtonText: 'Annuler'
  }).then((result) => {
    if (result.isConfirmed) {
      this.personnelService.deactivatePersonnel(id).subscribe(
        response => {
          Swal.fire({
            icon: 'success',
            title: 'Désactivé',
            text: 'Le personnel a été désactivé avec succès.',
          });
          this.getPersonnels(); // Met à jour la liste
        },
        error => {
          console.error("Erreur lors de la désactivation :", error);
          Swal.fire({
            icon: 'error',
            title: 'Erreur',
            text: 'Une erreur est survenue lors de la désactivation.',
          });
        }
      );
    }
  });
}
}
