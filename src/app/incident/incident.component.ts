import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Incident } from '../models/incident';
import { IncidentService } from './incident.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { forkJoin, map, Observable } from 'rxjs';
import { State } from '../models/state';
import { Type } from '../models/type';
import { User } from '../models/user';
import { LayoutService } from '../layout/layout.service';
import { Role } from '../models/role';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css'],
})
export class IncidentComponent implements OnInit {
  public incidents: Incident[] = [];
  user: User;
  displayedColumns: string[] = [
    'id_number',
    'title',
    'userid',
    'username',
    'type',
    'state',
  ];
  dataSource = new MatTableDataSource<Incident>(this.incidents);
  errorMessage = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private incidentService: IncidentService,
    private userService: UserService,
    private router: Router,
    private layoutService: LayoutService
  ) {
    this.user = layoutService.getUser();
  }

  ngOnInit() {
    this.getIncidents();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.filteredData.length === 0) {
      this.errorMessage = 'No hay incidentes para mostrar';
    } else {
      this.errorMessage = '';
    }
  }

  getIncidents(): void {
    switch (this.user.type) {
      case Role.Admin:
        this.fetchIncidents(this.incidentService.getAll());
        break;
      case Role.Client:
        this.fetchIncidents(this.incidentService.getByRole(this.user.id, Role.Client));
        break;
      case Role.Agent:
        this.fetchIncidents(this.incidentService.getByRole(this.user.id, Role.Agent));
        break;
    }
  }
  
  fetchIncidents(incidentObservable: Observable<Incident[]>): void {
    incidentObservable.subscribe((incidents) => {
      const userRequests = incidents.map((incident) =>
        this.userService.getById(incident.userid).pipe(
          map((user) => {
            incident.username = user.first_name + ' ' + user.last_name;
            return incident;
          })
        )
      );
  
      forkJoin(userRequests).subscribe((updatedIncidents) => {
        this.incidents = updatedIncidents;
        this.updateDataSource();
      });
    });
  }
  

  updateDataSource(): void {
    this.dataSource.data = this.incidents;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onCreate() {
    this.router.navigate(['/', 'app', 'create-incident']);
  }
  getIncidentStateString(state: State | null): string {
    if (state === null) return '';
    return State[state];
  }
  getTypeString(type: Type | null): string {
    if (type === null) return '';
    return Type[type];
  }
}
