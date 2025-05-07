
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Personnel, PersonnelService } from 'src/app/services/personnel.service';

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

  constructor(private personnelService: PersonnelService, private fb: FormBuilder) {

    this.personnelForm = this.fb.group({
      nom: ['', Validators.required],
      prenom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
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
      this.personnelService.addPersonnel(this.personnelForm.value).subscribe(
        response => {
          window.alert("Personnel ajouté avec succés!");
          this.personnelForm.reset();  // Réinitialiser le formulaire après ajout
          this.getPersonnels();
          setTimeout(() => {
            const closeBtn = document.getElementById('closeModalBtn') as HTMLElement;
            if (closeBtn) closeBtn.click();
          }, 100);
        },
        error => {
          console.error('Erreur lors de l’ajout du personnel', error);
          window.alert("❌ Une erreur est survenue lors de l’ajout !");

        }
      );
    } else {
      window.alert("⚠️ Veuillez remplir tous les champs obligatoires !");
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

      // Vérification si le mot de passe est vide
      const formValues = this.editPersonnelForm.value;

      // Si le mot de passe est vide, on ne l'envoie pas dans l'objet de mise à jour
      if (!formValues.motDePasse) {
        delete formValues.motDePasse;
      }
     
      this.personnelService.updatePersonnel(this.selectedPersonnelId, this.editPersonnelForm.value)
        .subscribe(updatePersonnel => {
          // Mise à jour de la liste des fournisseurs
          this.personnels = this.personnels.map(p =>
            p.id === this.selectedPersonnelId ? updatePersonnel : p
          );

          // Fermer le modal
          document.getElementById('editPersonnelModal')?.classList.remove('show');
          document.body.classList.remove('modal-open');
          document.querySelector('.modal-backdrop')?.remove();
        });
    }
  }
}
