import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  motDePasse: string = '';
  messageErreur: string = '';

  constructor(private authService: LoginService, private router: Router) { }

  onSubmit(): void {
    this.authService.login(this.email, this.motDePasse).subscribe(
      (response) => {
        console.log(response);
        alert('Connexion réussie !');
        this.router.navigate(['/dashboard']); 
      },
      (error) => {
        console.error(error);
        this.messageErreur = 'Email ou mot de passe incorrect';
      }
    );
  }
}
