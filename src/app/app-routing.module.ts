import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FournisseursComponent } from './components/fournisseurs/fournisseurs.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AddfournisseurComponent } from './components/addfournisseur/addfournisseur.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'ajouterfournisseurs', component: AddfournisseurComponent },
  { path: 'fournisseurs', component: FournisseursComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
