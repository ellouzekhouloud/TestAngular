import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { MessageService } from 'src/app/services/message.service';

@Component({
  selector: 'app-chat-popup',
  templateUrl: './chat-popup.component.html',
  styleUrls: ['./chat-popup.component.css']
})
export class ChatPopupComponent implements OnInit, AfterViewChecked {
  @Input() receiverId!: number;
  @Input() receiverNom!: string;
  @Output() closeChat = new EventEmitter<void>();
  senderId!: number;
  messages: any[] = [];
  newMessage: string = '';
  isVisible: boolean = true;

  @ViewChild('chatBody') chatBody!: ElementRef;

  constructor(
    private messageService: MessageService,
    private loginService: LoginService,
      

  ) {}

  ngOnInit(): void {
    this.senderId = this.loginService.getUserId()!;
    this.loadMessages();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  loadMessages(): void {
  this.messageService.getConversation(this.senderId, this.receiverId)
    .subscribe(data => {
      this.messages = data;

      // Marquer les messages reçus comme lus un par un
      this.messages.forEach(msg => {
        if (msg.sender.id === this.receiverId && !msg.isRead) {
          this.messageService.markAsRead(msg.id).subscribe();
        }
      });
    });
}


  sendMessage(): void {
    if (this.newMessage.trim() === '') return;

    const message = {
      sender: { id: this.senderId },
      receiver: { id: this.receiverId },
      content: this.newMessage
    };

    this.messageService.sendMessage(message).subscribe(sent => {
      this.messages.push(sent);
      this.newMessage = '';
      this.scrollToBottom();
    });
  }

  scrollToBottom(): void {
    try {
      this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Scroll error:', err);
    }
  }

  close(): void {
    this.closeChat.emit();
  }
}