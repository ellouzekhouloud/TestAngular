import { Injectable } from '@angular/core';
import * as SockJS from 'sockjs-client';

import * as Stomp from '@stomp/stompjs';
import { Client, Message } from '@stomp/stompjs'; 
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class NotificationSocketService {
  private stompClient!: Client;
  public notificationReceived = new Subject<string>();

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws-notifications');
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        this.stompClient.subscribe('/topic/notifications/controleur', (message: Message) => {
          this.notificationReceived.next(message.body); // ✅ envoie le message au composant
        });
      },
    });

    this.stompClient.activate();
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
