import { Component, OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: LoginService, private router: Router) {}

  ngOnInit() {
    // Si l'utilisateur n'est pas authentifié, on le redirige vers la page de login
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }
  
  
  title = 'Sidilec';

  
}
