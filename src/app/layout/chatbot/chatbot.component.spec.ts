import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ChatbotComponent } from './chatbot.component';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideNativeDateAdapter } from '@angular/material/core';
import { ChatMessage } from '../../models/chat-message';
import { of } from 'rxjs';
import { ChatbotService } from './chatbot.service';
import { MatIconModule } from '@angular/material/icon';

describe('ChatbotComponent', () => {
  let component: ChatbotComponent;
  let fixture: ComponentFixture<ChatbotComponent>;

  const mockChatbotService = {
    post: (data: ChatMessage) => {
      return of(data);
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatIconModule
      ],
      providers: [
        { provide: ChatbotService, useValue: mockChatbotService },
        provideNativeDateAdapter()
      ],
      declarations: [ChatbotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatbotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should send', fakeAsync(async () => {
    component.chatForm.get('message')?.setValue('Hola');
    component.send();
    tick(2100);
    fixture.detectChanges();
    expect(component.messages.length).toBe(2);
    expect(component.messages[1]).toEqual({
      text: 'Hola',
      fromUser: false
    });
  }));
});
