


import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layouts/header/header.component';
import { SidebarComponent } from './layouts/sidebar/sidebar.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
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

import { PlansDeControleComponent } from './components/plans-de-controle/plans-de-controle.component';
import { AuthInterceptor } from './AuthInterceptor';
import { ScanneComponent } from './pages/scanne/scanne.component';
import { AddBlComponent } from './pages/add-bl/add-bl.component';
import { ListBlComponent } from './pages/list-bl/list-bl.component';
import { NgChartsModule } from 'ng2-charts';
import { ControleByBlComponent } from './pages/controle-by-bl/controle-by-bl.component';

import { ControleComponent } from './pages/controle/controle.component';
import { ListeFichesDeRefusComponent } from './pages/liste-fiches-de-refus/liste-fiches-de-refus.component';
import { ListeEtiquetteVerteComponent } from './pages/liste-etiquette-verte/liste-etiquette-verte.component';
import { HistoriqueComponent } from './pages/historique/historique.component';
import { FamilleComponent } from './components/famille/famille.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';




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
    
    PlansDeControleComponent,
         ScanneComponent,
         AddBlComponent,
         ListBlComponent,
         ControleByBlComponent,
       
         ControleComponent,
                 ListeFichesDeRefusComponent,
                 ListeEtiquetteVerteComponent,
                 HistoriqueComponent,
                 FamilleComponent,
                 UnauthorizedComponent,
    


    


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NgChartsModule,
    
    
 
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
