import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChatMessage } from '../../models/chat-message';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  constructor(private http: HttpClient) { }

  public post(body: ChatMessage): Observable<ChatMessage> {
    return this.http.post<ChatMessage>(`${environment.usersURL}/chat`, body);
  }
}
