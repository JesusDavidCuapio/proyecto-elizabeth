import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cajero',
  standalone: true,
  templateUrl: './cajero.html',
  styleUrls: ['./cajero.css']
})
export class Cajero {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() consultarInventario = new EventEmitter<void>(); // NUEVO
  @Output() registrarVenta = new EventEmitter<void>();

  volver() {
    this.volverEvent.emit();
  }
}