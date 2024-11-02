/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Plan, PlanNames } from '../../../models/plan';
import { Router } from '@angular/router';
import { ClientService } from '../../create-client.service';

@Component({
  selector: 'app-selected-modal',
  templateUrl: './selected-modal.component.html',
  styleUrls: ['./selected-modal.component.css']
})
export class SelectedModalComponent {
  readonly dialogRef = inject(MatDialogRef<SelectedModalComponent>);
  planName: string;
  private clientId?: string | null = undefined;
  userData: any | undefined = undefined;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {plan: Plan},private router: Router, private clientService: ClientService) {  
   this.planName = PlanNames[data.plan];
  }
  getUserData() {
    this.clientService.user_token().subscribe((response: any) => {
      this.userData = response.data;   
      if (this.userData?.client_id != null || this.userData?.client_id != '') {       
        this.clientId = this.userData?.client_id;
      } else {
        console.error('No se pudo obtener el id del cliente');
      }
    });
  }
  goHome(){
    this.getUserData()
    setTimeout(() => {
      this.clientService.updatePlan(Number(this.clientId), this.data.plan).subscribe(
        () => {        
          this.dialogRef.close();
          this.router.navigate(['app/home']);
        },
        (error) => {
          console.error('Error al actualizar el plan:', error);
        }
      );
    }, 3000);
   
   
  }
}
