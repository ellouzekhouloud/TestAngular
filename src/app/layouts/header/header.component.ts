import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { NotificationSocketService } from 'src/app/services/notification-socket.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role!: string | null;
  nom!: string | null;
  activePath: string = '';
  notifications: any[] = [];

  constructor(private loginService: LoginService, private router: Router,
    private notificationService: NotificationService,
    private socketService: NotificationSocketService,private authService: LoginService,) { }

  ngOnInit(): void {
    this.role = this.loginService.getRole();
    this.nom = this.loginService.getNom();

    this.socketService.connect();

    // 🔁 Écoute des messages WebSocket
    this.socketService.notificationReceived.subscribe(() => {
      this.fetchNotifications(); // seule source fiable : depuis le backend
    });
    
    this.fetchNotifications(); // appeler UNE SEULE fois dans ngOnInit
  }

  fetchNotifications() {
    this.notificationService.getNotificationsControleur().subscribe({
      next: (data) => {
        this.notifications = data
          .map(n => ({
            ...n,
            isRead: n.isRead === true || n.isRead === 'true' || n.isRead === 1 
          }))
          .sort((a, b) => {
            if (a.isRead !== b.isRead) {
              return a.isRead ? 1 : -1; // Non lues en premier
            }
            // 🔁 Triage par date décroissante si même statut de lecture
            return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
          });
      },
      error: (err) => console.error(err)
    });
  }
  markAsRead(id: number) {
    this.notificationService.markAsRead(id).subscribe(() => {
      const notif = this.notifications.find(n => n.id === id);
      if (notif) {
        notif.isRead = true;
      }
    });
  }
  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  onLogout(): void {
    this.authService.logout();  
    this.router.navigate(['/login']);  
  }

}
