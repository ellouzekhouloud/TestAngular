import { Injectable } from '@angular/core';
import { Client, Message } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { ChatManagerService } from './chat-manager.service';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class MessageNotificationService {
private stompClient!: Client;
  public messageReceived = new Subject<string>();

  constructor(private chatManager: ChatManagerService) {}

  connect(userId: number): void {
    const socket = new SockJS('http://localhost:8080/ws');
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log('[WebSocket] ' + str),
      onConnect: () => {
        this.stompClient.subscribe(`/topic/notifications/user/${userId}`, (message: Message) => {
          this.messageReceived.next(message.body);

          // Analyse le message reçu
          const msg = JSON.parse(message.body);
          const senderId = msg.sender.id;
          
          // Ouvre automatiquement la fenêtre chat avec l’expéditeur
          this.chatManager.openChatWith(senderId);
        });
      }
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }
}
