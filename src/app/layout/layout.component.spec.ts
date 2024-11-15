import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { LayoutService } from './layout.service';
import { Router, RouterModule } from '@angular/router';
import { ChatbotComponent } from './chatbot/chatbot.component';
import { ChatbotService } from './chatbot/chatbot.service';
import { ChatMessage } from '../models/chat-message';


describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  const mockLayoutService = {getUser: () => of({userName: 'Test User', type: 0})};
  const mockChatbotService = {
    post: (data: ChatMessage) => {
      return of(data);
    }
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(
          []
        )
      ],
      declarations: [LayoutComponent, ChatbotComponent],
      providers: [
        { provide: LayoutService, useValue: mockLayoutService },
        { provide: ChatbotService, useValue: mockChatbotService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a menu button', () => {
    const compiled = fixture.nativeElement;
    const menuButton = compiled.querySelector('button[mat-icon-button]');
    expect(menuButton).toBeTruthy();
  });

  it('should toggle the sidenav when menu button is clicked', () => {
    const compiled = fixture.nativeElement;
    const menuButton = compiled.querySelector('button[mat-icon-button]');
    menuButton.click();
    fixture.detectChanges();
    const sidenav = compiled.querySelector('mat-sidenav');
    expect(sidenav.classList).not.toContain('mat-drawer-opened');
  });

  it('should have a sidenav with menu items', () => {
    fixture.detectChanges(); // Asegúrate de que los cambios se detecten
    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('mat-nav-list mat-list-item');
    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('should logout', () => {
    const service = fixture.debugElement.injector.get(Router);
    const serviceSpy = spyOn(service, 'navigate');
    component.logout();
    expect(serviceSpy).toHaveBeenCalledWith(['/login']);
  });
});
