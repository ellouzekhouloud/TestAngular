import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HttpClientModule } from '@angular/common/http';
import { FournisseursComponent } from './components/fournisseurs/fournisseurs.component';
import { AddfournisseurComponent } from './components/addfournisseur/addfournisseur.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProduitsComponent } from './components/produits/produits.component';
import { AddProduitComponent } from './components/add-produit/add-produit.component';
import { ViewProduitsFournisseurComponent } from './components/view-produits-fournisseur/view-produits-fournisseur.component';

import { PersonnelsComponent } from './components/personnels/personnels.component';
import { AddPersonnelComponent } from './components/add-personnel/add-personnel.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { LoginComponent } from './components/login/login.component';
import { ControleurComponent } from './pages/controleur/controleur.component';
import { HeaderControleComponent } from './pages/header-controle/header-controle.component';
import { PlansDeControleComponent } from './components/plans-de-controle/plans-de-controle.component';




@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    FournisseursComponent,
    AddfournisseurComponent,
    ProduitsComponent,
    AddProduitComponent,
    ViewProduitsFournisseurComponent,

    PersonnelsComponent,
    AddPersonnelComponent,
    LoginComponent,
    ControleurComponent,
    HeaderControleComponent,
    PlansDeControleComponent,
    


    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
