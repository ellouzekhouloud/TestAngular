import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseursComponent } from './components/fournisseurs/fournisseurs.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddfournisseurComponent } from './components/addfournisseur/addfournisseur.component';
import { ProduitsComponent } from './components/produits/produits.component';
import { AddProduitComponent } from './components/add-produit/add-produit.component';
import { ViewProduitsFournisseurComponent } from './components/view-produits-fournisseur/view-produits-fournisseur.component';
import { PersonnelsComponent } from './components/personnels/personnels.component';
import { AddPersonnelComponent } from './components/add-personnel/add-personnel.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderControleComponent } from './pages/header-controle/header-controle.component';
import { ControleurComponent } from './pages/controleur/controleur.component';
import { PlansDeControleComponent } from './components/plans-de-controle/plans-de-controle.component';





const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ajouterfournisseurs', component: AddfournisseurComponent },
  { path: 'fournisseurs', component: FournisseursComponent },
  { path: 'produits', component: ProduitsComponent },
  { path: 'ajouterproduit', component: AddProduitComponent },
  { path: 'fournisseurs/:id/produits', component: ViewProduitsFournisseurComponent },
  { path: 'personnels', component: PersonnelsComponent },
  { path: 'ajouterpersonnel', component: AddPersonnelComponent },
  { path: 'login', component: LoginComponent},
  //{ path: '**', redirectTo: 'dashboard' }, // Redirection en cas de route inexistante
  { path: 'headercontrole', component: HeaderControleComponent},
  { path: 'controle', component: ControleurComponent},
  { path: 'plans-de-controle/:idProduit', component: PlansDeControleComponent },
  
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
