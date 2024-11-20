import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { IncidentService } from '../incident/incident.service';
import { LayoutService } from '../layout/layout.service';
import { Channel } from '../models/channel';
import { Incident } from '../models/incident';
import { Role } from '../models/role';
import { State } from '../models/state';
import { User } from '../models/user';
import { Type } from '../models/type';
@Component({
  selector: 'app-control-board-predicitve',
  templateUrl: './control-board-predicitve.component.html',
  styleUrls: ['./control-board-predicitve.component.css']
})
export class ControlBoardPredicitveComponent implements OnInit {

  constructor(private incidentService: IncidentService, 
    private layoutService: LayoutService) {      
     }
  startDate: Date | null = null;
  endDate: Date | null = null;
  minDate: Date | null = null;
  maxDate: Date | null = null;
  incidents: Incident[] = [];
  totalNumber = 0;
  user: User | undefined;
  pieChart: Chart<'pie'> | undefined;
  barChart: Chart<'bar'> | undefined;
  barTypeChart: Chart<'bar'> | undefined;
  incidentsByDate: Incident[] = [];
  hasTitle = false;
  
  ngOnInit() {   
    this.getUser()
    this.incidentService.getByRole(Number(this.user?.client_id), Role.Client)
    .subscribe((incidents) => { 
      const currentDate = new Date();
      this.minDate =new Date();;
      this.maxDate = new Date(currentDate.setMonth(currentDate.getMonth() + 6)); 
      this.incidents = incidents;
      this.updateCharts(this.incidents);   
    });    
  }
  getUser() {
    this.user = this.layoutService.getUser();
  }
  onDateChange() {
    if (this.startDate && this.endDate) {
      this.hasTitle = true;
      const randomCount = Math.floor(Math.random() * 100) + 1;
      this.incidentsByDate = this.generateRandomIncidents(randomCount); 
      this.updateCharts(this.incidentsByDate);  
    }
  }
  generateRandomIncidents(count: number): Incident[] {
    const states = [State.Open, State.Closed, State.InProgress, State.Canceled];
    const types = [Type.Other, Type.Hardaware, Type.Users, Type.Software, Type.Hardaware, Type.Techincal];
    const channels = [Channel.Web, Channel.Email, Channel.Mobile];
    const incidents: Incident[] = [];

    for (let i = 0; i < count; i++) {
      const randomState = states[Math.floor(Math.random() * states.length)];
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];
      const randomDate = new Date(
        this.startDate!.getTime() + Math.random() * (this.endDate!.getTime() - this.startDate!.getTime())
      );

      incidents.push({
        title: 'Incidente aleatorio',
        description: 'Descripción aleatoria',
        clientid: '1',
        serviceid: '1',
        userid: '1',
        agentid: '1',
        state: randomState,
        type: randomType,
        channel: randomChannel,
        createat: randomDate
      });
    }

    return incidents;
  }

  destroyCharts() {
    if (this.pieChart) {
      this.pieChart.destroy();
    }
     if (this.barChart) {
       this.barChart.destroy();   
     }
    if (this.barTypeChart) {
      this.barTypeChart.destroy();
     }
  }
  updateCharts(incidents: Incident[]) {
    this.destroyCharts();
    this.totalNumber = incidents.length;   

    this.createPieChart(incidents);
    this.createBarChart(incidents);
    this.createTypeBarChart(incidents);
  }
  
  createPieChart(incidents: Incident[]) {
    let openValue = 0;
    let closedValue = 0;
    let inProgressValue = 0;
    let canceledValue = 0;
    incidents.forEach(incident => {
      switch (incident.state) {
        case State.Open:
          openValue++;
          break;
        case State.Closed:
          closedValue++;
          break;
        case State.InProgress:
          inProgressValue++;
          break;
        case State.Canceled:
          canceledValue++;
          break;
      }
    });
    const ctx = document.getElementById('pieChart') as HTMLCanvasElement;
    this.pieChart =new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['Abierto', 'Cerrado', 'En progreso', 'Cancelado'],
        datasets: [{
          data: [openValue, closedValue, inProgressValue, canceledValue],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
  createBarChart(incidents: Incident[]) {
    let webValue = 0;
    let movilValue = 0;
    let emailValue = 0;   
    incidents.forEach(incident => {
      switch (incident.channel) {
        case Channel.Web:
          webValue++;
          break;
        case Channel.Mobile:
          movilValue++;
          break;
        case Channel.Email:
          emailValue++;
          break;       
      }
    });
    const ctx = document.getElementById('barChart') as HTMLCanvasElement;
   this.barChart  = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Web', 'Móvil', 'Correo'],
        datasets: [{
          label: 'Canal de contacto',
          data: [webValue, movilValue, emailValue],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
  createTypeBarChart(incidents: Incident[]) {
    let otherValue = 0;
    let thecnicalValue = 0;
    let usersValue = 0;
    let softwareValue = 0;
    let hardwareValue = 0;
    incidents.forEach(incident => {
      switch (incident.type) {
        case Type.Other:
          otherValue++;
          break;
        case Type.Techincal:
          thecnicalValue++;
          break;
        case Type.Users:
          usersValue++;
          break;
        case Type.Software:
          softwareValue++;
          break;
        case Type.Hardaware:
          hardwareValue++;
          break;
      }
    });
    const ctx = document.getElementById('typeBarChart') as HTMLCanvasElement;
    this.barTypeChart =new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Otro', 'Técnico', 'Usuarios', 'Software', 'Hardware'],
        datasets: [{
          label: 'Tipo Incidente',
          data: [otherValue, thecnicalValue, usersValue, softwareValue, hardwareValue],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
