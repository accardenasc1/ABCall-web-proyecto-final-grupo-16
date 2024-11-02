// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { SelectPlanComponent } from './select-plan.component';
// import { ClientService } from '../../create-client.service';
// import { Router } from '@angular/router';
// import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// import { SelectedModalComponent } from '../../selected-modal/selected-modal/selected-modal.component';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// describe('SelectPlanComponent', () => { 
//   let fixture: ComponentFixture<SelectPlanComponent>;


//   beforeEach(async () => {
//     const clientServiceSpy = jasmine.createSpyObj('ClientService', ['user_token', 'updatePlan']);
//     const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
//     const dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'afterAllClosed']);

//     await TestBed.configureTestingModule({
//       declarations: [SelectPlanComponent, SelectedModalComponent],
//       imports: [HttpClientTestingModule, MatDialogModule, ReactiveFormsModule, BrowserAnimationsModule],
//       providers: [
//         { provide: ClientService, useValue: clientServiceSpy },
//         { provide: Router, useValue: routerSpy },
//         { provide: MatDialog, useValue: dialogSpy },
//       ],
//     }).compileComponents();


//     fixture = TestBed.createComponent(SelectPlanComponent);  
//     fixture.detectChanges();
//   });
 
// });