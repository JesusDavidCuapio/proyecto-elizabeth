import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-auxiliar',
  standalone: true,
  templateUrl: './auxiliar.html',
  styleUrls: ['./auxiliar.css']
})
export class Auxiliar {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() consultarInventario = new EventEmitter<void>();
  @Output() recibirProductos = new EventEmitter<void>();

  onConsultarInventario() {
    this.consultarInventario.emit();
  }

  onRecibirProductos() {
    this.recibirProductos.emit();
  }

  volver() {
    this.volverEvent.emit();
  }
}