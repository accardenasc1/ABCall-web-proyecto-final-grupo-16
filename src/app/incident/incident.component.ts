import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Incident } from '../models/incident';
import { IncidentService } from './incident.service';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { forkJoin,  map,  } from 'rxjs';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})
export class IncidentComponent implements OnInit {

  private incidents: Incident[] = [];
  displayedColumns: string[] = ['id_number', 'title', 'userid', 'username', 'type', 'state'];
  dataSource = new MatTableDataSource<Incident>(this.incidents);
  errorMessage = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private incidentService: IncidentService,
    private userService: UserService,
    private router: Router
  ) { }

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
    this.incidentService.getAll().subscribe((incidents) => {
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
}