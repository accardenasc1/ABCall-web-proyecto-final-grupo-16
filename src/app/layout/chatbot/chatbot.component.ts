import { Component } from '@angular/core';
import { ChatMessage } from '../../models/chat-message';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatbotService } from './chatbot.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  isOpen = false;
  chatForm = new FormGroup({
    message: new FormControl('')
  });
  messages: ChatMessage[] = []

  constructor(private chatbotService: ChatbotService) {

  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  send() {
    const value = this.chatForm.value.message;

    if (!value)
      return;

    this.messages.push({ text: value, fromUser: true });
    this.chatForm.get('message')?.setValue('');
    this.messages.push({ text: '', fromUser: false });

    this.chatbotService.post({ text: value, fromUser: true }).pipe(delay(2000)).subscribe(res => {
      this.messages[this.messages.length  -1].text = res.text;
    });
  }
}
