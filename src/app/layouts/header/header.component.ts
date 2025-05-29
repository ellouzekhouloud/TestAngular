import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { ChatManagerService } from 'src/app/services/chat-manager.service';
import { LoginService } from 'src/app/services/login.service';
import { MessageNotificationService } from 'src/app/services/message-notification.service';
import { Message, MessageService } from 'src/app/services/message.service';
import { NotificationSocketService } from 'src/app/services/notification-socket.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Personnel, PersonnelService } from 'src/app/services/personnel.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  role!: string | null;
  nom!: string | null;
  prenom!: string | null;
  activePath: string = '';
  notifications: any[] = [];

  unreadMessages: Message[] = [];
  messageCount = 0;
  private messageSub?: Subscription;
  personnels: any[] = [];
  showPersonnelDropdown = false;
  Mnotifications: string[] = [];
  openedChats: number[] = []; // tableau des receiverId des chats ouverts
  private chatSubscription: any;

  selectedReceiverId: number | null = null;
  selectedReceiverName = '';
  unreadSenderIds: number[] = [];

  // Liste des autres utilisateurs
  currentUserId: number = 1;    // Simule l’utilisateur connecté (remplace ça par un vrai service de login plus tard)
  selectedPersonnel: Personnel | null | undefined;
  showPersonnelList = false;    // Affiche ou cache la liste déroulante

  lastMessages: { [key: number]: string } = {};

  constructor(private loginService: LoginService, private router: Router,
    private notificationService: NotificationService,
    private socketService: NotificationSocketService, private authService: LoginService,
    private personnelService: PersonnelService, private messageNotificationService: MessageNotificationService,
    private messageService: MessageService,
    private chatManager: ChatManagerService) { }

  ngOnInit(): void {
    this.loadUnreadMessages();

    this.loadPersonnels();
    const userId = this.loginService.getUserId();
    this.role = this.loginService.getRole();
    this.nom = this.loginService.getNom();
    this.prenom = this.loginService.getPrenom();
    this.socketService.connect();

    // 🔁 Écoute des messages WebSocket
    this.socketService.notificationReceived.subscribe(() => {
      this.fetchNotifications(); // seule source fiable : depuis le backend
    });

    this.fetchNotifications(); // appeler UNE SEULE fois dans ngOnInit
    if (userId !== null) {
      this.messageNotificationService.connect(userId); // ✅ sûr pour TypeScript
    }
    if (userId !== null) {
      this.messageNotificationService.connect(userId);


    }
    this.chatSubscription = this.chatManager.openChat$.subscribe(senderId => {
      // Récupérer les infos du personnel (nom)
      this.personnelService.getPersonnelById(senderId).subscribe(personnel => {
        if (personnel) {
          this.chatReceiverId = personnel.id;
          this.chatReceiverNom = personnel.nom;
        }
      });
    });
  }
  loadUnreadMessages() {
    const userId = this.loginService.getUserId();
    if (!userId) return;

    this.messageSub = this.messageService.getUnreadMessages(userId).subscribe(messages => {
      this.unreadMessages = messages;
      this.messageCount = messages.length;
    });
  }
  markMessageAsRead(messageId: number) {
    this.messageService.markAsRead(messageId).subscribe(() => {
      const index = this.unreadMessages.findIndex(m => m.id === messageId);
      if (index !== -1) {
        this.unreadMessages.splice(index, 1);
        this.messageCount = this.unreadMessages.length;
      }
    });
  }
  fetchMessageNotifications() {
    const receiverId = this.loginService.getUserId();
    if (!receiverId) return;

    this.unreadSenderIds = []; // Réinitialiser

    // Pour chaque personnel, vérifier s'il a des messages non lus
    this.personnels.forEach(p => {
      if (p.id !== receiverId) { // Ne pas vérifier soi-même
        this.messageService.getUnreadCount(p.id, receiverId).subscribe(count => {
          if (count > 0) {
            this.unreadSenderIds.push(p.id);
          }
        });
      }
    });
  }
  isUnread(personnelId: number): boolean {
    return this.unreadSenderIds.includes(personnelId);
  }
  closePopupChat(): void {
    this.chatReceiverId = null;
    this.chatReceiverNom = null;
  }
  ngOnDestroy(): void {
    // Se désabonner pour éviter les fuites mémoire
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }
  togglePersonnelDropdown() {
    this.showPersonnelDropdown = !this.showPersonnelDropdown;
  }
  chatReceiverId: number | null = null;
  chatReceiverNom: string | null = null;

  openPopupChat(receiverId: number, receiverNom: string): void {
    this.chatReceiverId = receiverId;
    this.chatReceiverNom = receiverNom;
    // ✅ Supprimer le receiverId des non lus
    const index = this.unreadSenderIds.indexOf(receiverId);
    if (index !== -1) {
      this.unreadSenderIds.splice(index, 1);
    }

    // 🔁 Appeler le backend pour marquer comme lu tous les messages de ce receiver
    this.messageService.markAsRead(receiverId).subscribe(() => {
      this.loadUnreadMessages(); // 🔄 Met à jour le compteur global si besoin
    });
  }

  loadPersonnels() {
    const currentUserId = this.loginService.getUserId();
    this.personnelService.getActivePersonnels().subscribe({
      next: (data) => {
        // ❌ Supprime l'utilisateur connecté de la liste
        this.personnels = data.filter(p => p.id !== currentUserId);
        this.fetchMessageNotifications();
        this.loadLastMessagesForAll();
      },
      error: (error) => {
        console.error('Erreur de chargement des personnels', error);
      }
    });
  }


  togglePersonnelList() {
    this.showPersonnelList = !this.showPersonnelList;
  }

  openChat(personnel: Personnel): void {
    this.selectedPersonnel = personnel;
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
  startChat(receiverId: number, name: string) {
    this.selectedReceiverId = receiverId;
    this.selectedReceiverName = name;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loadLastMessagesForAll(): void {
    const currentUserId = this.loginService.getUserId();
    if (!currentUserId) return;

    this.personnels.forEach(p => {
      if (p.id !== currentUserId) {
        this.messageService.getLastMessageBetweenUsers(p.id, currentUserId).subscribe({
          next: (message) => {
            this.lastMessages[p.id] = message ? message.content : 'Aucun message';
          },
          error: () => {
            this.lastMessages[p.id] = 'Erreur de chargement';
          }
        });
      }
    });
  }

}
