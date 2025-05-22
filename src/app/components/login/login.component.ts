import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { NotificationSocketService } from 'src/app/services/notification-socket.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  motDePasse: string = '';
  messageErreur: string = '';
  showPassword: boolean = false;
  rememberMe: boolean = false;

  constructor(private authService: LoginService, private router: Router,
    private webSocketService: NotificationSocketService
  ) { }
  ngOnInit() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const role = localStorage.getItem('role') || sessionStorage.getItem('role');

    if (token && role) {
      // 🔄 Connexion au websocket
      this.webSocketService.connect();

      // ✅ Redirection en fonction du rôle
      switch (role) {
        case 'ADMIN':
          this.router.navigate(['/dashboard']);
          break;
        case 'RESPONSABLE_RECEPTION':
        case 'CONTROLEUR':
          this.router.navigate(['/controle']);
          break;
        default:
          this.router.navigate(['/login']);
      }
    }
  }

  onSubmit(): void {
    this.authService.login(this.email, this.motDePasse, this.rememberMe).subscribe({
      next: (response) => {
        console.log(response);

        if (response.role) {
          this.webSocketService.connect();
          switch (response.role) {
            case 'ADMIN':
              this.router.navigate(['/dashboard']);
              break;
            case 'RESPONSABLE_RECEPTION':
            case 'CONTROLEUR':
              this.router.navigate(['/controle']);
              break;
            default:
              this.router.navigate(['/login']);
          }
        }
      },
      error: (error) => {
        console.error(error);
        if (error.status === 403 && error.error?.message) {
          this.messageErreur = error.error.message;
        } else {
          this.messageErreur = "Email ou mot de passe incorrect";
        }
      }
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

}
