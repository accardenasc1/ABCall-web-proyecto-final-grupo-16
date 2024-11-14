import { TestBed } from '@angular/core/testing';

import { ChatbotService } from './chatbot.service';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatMessage } from '../../models/chat-message';
import { environment } from '../../../environments/environment';

describe('ChatbotService', () => {
  let service: ChatbotService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(ChatbotService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should request user sign up', async () => {
    const data = { text: 'Hola', fromUser: true } as ChatMessage;
    const httpTesting = TestBed.inject(HttpTestingController);
    const response = service.post(data).toPromise();
    const req = httpTesting.expectOne(`${environment.usersURL}/chatbot`);
    expect(req.request.method).toBe('POST');
    req.flush(data);
    expect(await response).toEqual(data);
    httpTesting.verify();
  });
});
