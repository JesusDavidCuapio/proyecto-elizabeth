import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-almacenista',
  standalone: true,
  templateUrl: './almacenista.html',
  styleUrls: ['./almacenista.css']
})
export class Almacenista {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() consultarInventario = new EventEmitter<void>();
  @Output() actualizarExistencias = new EventEmitter<void>();
  @Output() reportarProducto = new EventEmitter<void>();

  onConsultarInventario() {
    this.consultarInventario.emit();
  }

  onActualizarExistencias() {
    this.actualizarExistencias.emit();
  }

  onReportarProducto() {
    this.reportarProducto.emit();
  }

  volver() {
    this.volverEvent.emit();
  }
}