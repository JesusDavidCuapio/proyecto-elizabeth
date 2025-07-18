import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-ver-reportes',
  standalone: true,
  templateUrl: './ver-reportes.html',
  styleUrls: ['./ver-reportes.css']
})
export class VerReportes {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() verVentas = new EventEmitter<void>(); // <-- AGREGA ESTO
  @Output() verReportesProductos = new EventEmitter<void>();

  verVentasClick() {
  this.verVentas.emit();
}

  verProductosDanados() {
  this.verReportesProductos.emit();
}
  volver() {
    this.volverEvent.emit();
  }
}