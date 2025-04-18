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
import { ControleurComponent } from './pages/controleur/controleur.component';
import { PlansDeControleComponent } from './components/plans-de-controle/plans-de-controle.component';
import { AuthGuard } from './auth.guard'; 
import { ScanneComponent } from './pages/scanne/scanne.component';
import { AddBlComponent } from './pages/add-bl/add-bl.component';
import { ListBlComponent } from './pages/list-bl/list-bl.component';
import { ControleByBlComponent } from './pages/controle-by-bl/controle-by-bl.component';
import { ControleProduitComponent } from './pages/controle-produit/controle-produit.component';
import { ControleComponent } from './pages/controle/controle.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent }, // ✅ Accessible sans connexion

  // 🔒 Routes protégées par AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'ajouterfournisseurs', component: AddfournisseurComponent, canActivate: [AuthGuard] },
  { path: 'fournisseurs', component: FournisseursComponent, canActivate: [AuthGuard] },
  { path: 'produits', component: ProduitsComponent, canActivate: [AuthGuard] },
  { path: 'ajouterproduit', component: AddProduitComponent, canActivate: [AuthGuard] },
  { path: 'fournisseurs/:id/produits', component: ViewProduitsFournisseurComponent, canActivate: [AuthGuard] },
  { path: 'personnels', component: PersonnelsComponent, canActivate: [AuthGuard] },
  { path: 'ajouterpersonnel', component: AddPersonnelComponent, canActivate: [AuthGuard] },
  { path: 'controle', component: ControleurComponent, canActivate: [AuthGuard] },
  { path: 'plans-de-controle/:idProduit', component: PlansDeControleComponent, canActivate: [AuthGuard] },
  { path: 'scanner', component: ScanneComponent, canActivate: [AuthGuard] },
  { path: 'addBL', component: AddBlComponent, canActivate: [AuthGuard] },
  { path: 'ListBL', component: ListBlComponent, canActivate: [AuthGuard] },
  { path: 'controles-en-cours', component: ControleByBlComponent, canActivate: [AuthGuard] },
  { path: 'controle-produit/:id', component: ControleProduitComponent, canActivate: [AuthGuard] },
  { path: 'controler/:id', component: ControleComponent, canActivate: [AuthGuard] },
  // 🔄 Redirection vers `/login` si la route n'existe pas
  { path: '**', redirectTo: '/login' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
