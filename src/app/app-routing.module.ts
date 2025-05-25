import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseursComponent } from './components/fournisseurs/fournisseurs.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { ProduitsComponent } from './components/produits/produits.component';

import { ViewProduitsFournisseurComponent } from './components/view-produits-fournisseur/view-produits-fournisseur.component';
import { PersonnelsComponent } from './components/personnels/personnels.component';

import { LoginComponent } from './components/login/login.component';
import { ControleurComponent } from './pages/controleur/controleur.component';
import { PlansDeControleComponent } from './components/plans-de-controle/plans-de-controle.component';
import { AuthGuard } from './auth.guard'; 
import { ScanneComponent } from './pages/scanne/scanne.component';
import { AddBlComponent } from './pages/add-bl/add-bl.component';
import { ListBlComponent } from './pages/list-bl/list-bl.component';


import { ControleComponent } from './pages/controle/controle.component';
import { ListeFichesDeRefusComponent } from './pages/liste-fiches-de-refus/liste-fiches-de-refus.component';
import { ListeEtiquetteVerteComponent } from './pages/liste-etiquette-verte/liste-etiquette-verte.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { FamilleComponent } from './components/famille/famille.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // ✅ Accessible sans connexion

  // 🔒 Routes protégées par AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] , data: { role: 'ADMIN' }},
  
  { path: 'fournisseurs', component: FournisseursComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'produits', component: ProduitsComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'familles', component: FamilleComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'fournisseurs/:id/produits', component: ViewProduitsFournisseurComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'personnels', component: PersonnelsComponent, canActivate: [AuthGuard] , data: { role: 'ADMIN' }},
  
  { path: 'controle', component: ControleurComponent, canActivate: [AuthGuard] },
  { path: 'plans-de-controle/:idProduit', component: PlansDeControleComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' } },
  { path: 'scanner', component: ScanneComponent, canActivate: [AuthGuard],  data: { roles: ['RESPONSABLE_RECEPTION', 'CONTROLEUR'] }},
  { path: 'addBL', component: AddBlComponent, canActivate: [AuthGuard], data: { role: 'RESPONSABLE_RECEPTION' } },
  { path: 'ListBL', component: ListBlComponent, canActivate: [AuthGuard],  data: { roles: ['RESPONSABLE_RECEPTION', 'CONTROLEUR'] } },
  
  { path: 'controler/:id', component: ControleComponent, canActivate: [AuthGuard],  data: { roles: ['RESPONSABLE_RECEPTION', 'CONTROLEUR'] } },
  { path: 'etiquette', component: ListeEtiquetteVerteComponent, canActivate: [AuthGuard],  data: { roles: ['RESPONSABLE_RECEPTION', 'CONTROLEUR'] } },
  { path: 'fiches-refus', component: ListeFichesDeRefusComponent, canActivate: [AuthGuard],  data: { roles: ['RESPONSABLE_RECEPTION', 'CONTROLEUR'] } },
  { path: 'historique', component:HistoriqueComponent, canActivate: [AuthGuard],  data: { roles: ['RESPONSABLE_RECEPTION', 'CONTROLEUR'] } },
  { path: 'unauthorized', component: UnauthorizedComponent },
  // 🔄 Redirection vers `/login` si la route n'existe pas
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
