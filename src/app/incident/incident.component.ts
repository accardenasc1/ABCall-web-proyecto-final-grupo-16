import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Incident } from '../models/incident';
import { IncidentService } from './incident.service';

@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})

export class IncidentComponent implements OnInit{

  private incidents: Incident[] = [];
  displayedColumns: string[] = ['title', 'id', 'userid', 'type', 'state'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private incidentService: IncidentService ) { }

  ngOnInit() {    
    this.getIncidents();    
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getIncidents(): void {
    this.incidentService.getAll().subscribe((incidents) => {
      this.incidents = incidents;     
      this.dataSource.data = this.incidents;
      this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort; 
    });
  }


}

