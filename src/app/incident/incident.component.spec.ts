import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncidentComponent } from './incident.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('IncidentComponent', () => {
  let component: IncidentComponent;
  let fixture: ComponentFixture<IncidentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncidentComponent ],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IncidentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render table with data', () => {
    const compiled = fixture.nativeElement;
    const tableRows = compiled.querySelectorAll('tr.mat-row');
    expect(tableRows.length).toBe(5); // Verifica que hay 5 filas de datos
  });

  it('should filter data based on input', () => {
    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('#idIncidenteSearch');
    input.value = '262';
    input.dispatchEvent(new Event('keyup'));
    fixture.detectChanges();

    const tableRows = compiled.querySelectorAll('tr.mat-row');
    expect(tableRows.length).toBe(1); // Verifica que solo hay una fila después del filtro
    expect(tableRows[0].textContent).toContain('262'); // Verifica que la fila contiene el id filtrado
  });

  it('should render "incident works!"', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('p').textContent).toContain('Incidentes Componente!');
  });
});