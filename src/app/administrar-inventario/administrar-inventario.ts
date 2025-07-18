import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-administrar-inventario',
  standalone: true,
  templateUrl: './administrar-inventario.html',
  styleUrls: ['./administrar-inventario.css']
})
export class AdministrarInventario {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() consultarInventarioEvent = new EventEmitter<void>();
  @Output() recibirProductosEvent = new EventEmitter<void>();
  @Output() actualizarExistenciasEvent = new EventEmitter<void>();
  @Output() reportarProductoEvent = new EventEmitter<void>();

  consultarInventario() {
    this.consultarInventarioEvent.emit();
  }

  recibirProductos() {
    this.recibirProductosEvent.emit();
  }

  actualizarExistencias() {
    this.actualizarExistenciasEvent.emit();
  }

  reportarProducto() {
    this.reportarProductoEvent.emit();
  }

  volver() {
    this.volverEvent.emit();
  }
}