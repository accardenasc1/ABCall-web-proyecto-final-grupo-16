import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatIconModule,
        MatButtonModule,
        BrowserAnimationsModule,
        RouterTestingModule
      ],
      declarations: [LayoutComponent]
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
});