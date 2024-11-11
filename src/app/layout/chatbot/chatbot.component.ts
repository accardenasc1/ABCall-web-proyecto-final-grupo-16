import { Component } from '@angular/core';
import { ChatMessage } from '../../models/chat-message';
import { FormControl, FormGroup } from '@angular/forms';
import { ChatbotService } from './chatbot.service';

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
  loading = true;

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

    this.loading = true;
    this.chatbotService.post({ text: value, fromUser: true }).subscribe(res => {
      this.loading = false;
      this.messages.push(res);
    });
  }
}
