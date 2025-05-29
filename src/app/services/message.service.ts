import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { Observable } from 'rxjs';

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  content: string;
  isRead: boolean;
  timestamp: string;
  senderNom: string;
}
@Injectable({
  providedIn: 'root'
})

export class MessageService {

 private apiUrl = 'http://localhost:8080/api/messages'; // j'ai corrigé ton URL aussi (tu avais /messages, maintenant tu mets /api/messages)

  constructor(private http: HttpClient, private loginService: LoginService) { } // <<< injecter LoginService

  getAuthHeaders(): HttpHeaders {
    const token = this.loginService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
  markAsRead(messageId: number) {
    return this.http.put(`${this.apiUrl}/${messageId}/read`, {}, { headers: this.getAuthHeaders() });
  }
  
  getUnreadCount(senderId: number, receiverId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count/${senderId}/${receiverId}`);
  }
  getUnreadSenders(receiverId: number) {
  return this.http.get<number[]>(`${this.apiUrl}/unread-senders/${receiverId}`);
}
 getUnreadMessages(receiverId: number): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/unread/${receiverId}`);
  }

  

  getConversation(senderId: number, receiverId: number) {
    return this.http.get<any[]>(`${this.apiUrl}/${senderId}/${receiverId}`, { headers: this.getAuthHeaders() });
}

sendMessage(message: { sender: any; receiver: any; content: string }) {
    return this.http.post(`${this.apiUrl}`, message, { headers: this.getAuthHeaders() });
}

getLastMessageBetweenUsers(senderId: number, receiverId: number): Observable<Message | null> {
    const params = new HttpParams()
      .set('senderId', senderId.toString())
      .set('receiverId', receiverId.toString());

    return this.http.get<Message>(`${this.apiUrl}/last`, { params });
  }

}
