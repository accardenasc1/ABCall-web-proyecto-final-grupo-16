import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Incident } from '../models/incident';

const ELEMENT_DATA: Incident[] = [
  {title: 'Asignación permisos usuario', id: 262, userid: 23, type: 'Permisos', state: 'Teléfono'},
  {title: 'Creación usuario en BD', id: 159, userid: 24, type: 'Usuarios', state: 'Móvil'},
  {title: 'Modificar correo de usuario', id: 237, userid: 37, type: 'Usuarios', state: 'Correo'},
  {title: 'Problema en registro BD', id: 356, userid: 49, type: 'Aplicaciones', state: 'Correo'},
  {title: 'Reporte genera error empresa', id: 452, userid: 51, type: 'Aplicaciones', state: 'Móvil'},
];
@Component({
  selector: 'app-incident',
  templateUrl: './incident.component.html',
  styleUrls: ['./incident.component.css']
})

export class IncidentComponent implements OnInit{

  displayedColumns: string[] = ['title', 'id', 'userid', 'type', 'state'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {    
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}

