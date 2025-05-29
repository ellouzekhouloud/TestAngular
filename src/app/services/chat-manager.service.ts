import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatManagerService {
private openChatSubject = new Subject<number>(); // userId destinataire

  openChat$ = this.openChatSubject.asObservable();

  openChatWith(userId: number) {
    this.openChatSubject.next(userId);
  }
}
