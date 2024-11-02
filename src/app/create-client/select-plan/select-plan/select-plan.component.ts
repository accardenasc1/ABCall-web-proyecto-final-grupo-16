import { Component, inject,  OnInit } from '@angular/core';
import { Plan } from '../../../models/plan';
import { ClientService } from '../../create-client.service';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SelectedModalComponent } from '../../selected-modal/selected-modal/selected-modal.component';

@Component({
  selector: 'app-select-plan',
  templateUrl: './select-plan.component.html',
  styleUrls: ['./select-plan.component.css'],
})
export class SelectPlanComponent implements OnInit {  
 
  private hasClientAssigned: boolean | undefined = false;
  
  public plans: {
    plan: Plan;
    title: string;
    benefits: string;
    description: string;
    selectable: boolean;
  }[] = [];
  selectPlanForm = new FormGroup({});
  selectedPlan: Plan | undefined = undefined;
  readonly dialog = inject(MatDialog);
  constructor(private clientService: ClientService, private router: Router) {        
    
  }
  ngOnInit(): void {
  
    this.plans = [
      {
        plan: Plan.ENTREPRENEUR,
        title: 'PLAN EMPRENDEDOR',
        benefits: 'Beneficios',
        description: 'información plan emprendedor',
        selectable: true,
      },
      {
        plan: Plan.BUSINESSMAN,
        title: 'PLAN EMPRESARIO',
        benefits: 'Beneficios',
        description: 'Descripción del plan empresario',
        selectable: false,
      },
      {
        plan: Plan.PLUS_BUSINESSMAN,
        title: 'PLAN EMPRESARIO PLUS',
        benefits: 'Beneficios',
        description: 'Descripción del plan empresario plus',
        selectable: false,
      },
    ];
   // this.getUserData();
   
  }

  selectPlan(selectedPlan: Plan): void {
    this.plans.forEach((plan) => {
      plan.selectable = plan.plan === selectedPlan;
      this.selectedPlan = selectedPlan;
    });    
    this.onOpenModal();
    
  }
  goBack() {
    this.router.navigate(['/', 'app', 'client']);
  }

  onOpenModal() {
    this.dialog.open(SelectedModalComponent, {
      width: '600px',
      data: { plan: this.selectedPlan },
    });

    this.dialog.afterAllClosed.subscribe(() => this.router.navigate(['']));
  }
}
