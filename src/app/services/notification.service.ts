import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  read: boolean; // ← correspond à la propriété `read` du backend
  isRead?: boolean | string | number; // ← propriété temporaire pour l’affichage dans le frontend
  role: string;
  timestamp: string; // ← pour pouvoir trier les notifications par date
  bl: any; // tu peux affiner le typage plus tard
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = 'http://localhost:8080/api/notifications';

  constructor(private http: HttpClient) {}

  getNotificationsControleur(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/controleur`);
  }

  markAsRead(id: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}/read`, {});
  }
}
