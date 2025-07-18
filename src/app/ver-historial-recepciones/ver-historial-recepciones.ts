import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ver-historial-recepciones',
  templateUrl: './ver-historial-recepciones.html',
  styleUrls: ['./ver-historial-recepciones.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, CurrencyPipe, FormsModule]
})
export class VerHistorialRecepciones {
  historial: any[] = [];
  historialFiltrado: any[] = [];
  mensaje = '';

  // Filtros
  filtroFecha = '';
  filtroUnidadMedida = '';
  filtroTipoProducto = '';

  // Tipos disponibles
  tiposUnidad = ['Piezas', 'Paquete', 'kg', 'Gramos', 'Por caja'];
  tiposProducto = ['Abarrotes', 'Lácteos', 'Huevos', 'Bebida', 'Botanas - frituras', 'Dulces', 'Higiene personal', 'Limpieza'];

  @Output() volverEvent = new EventEmitter<void>();

  constructor(private api: ApiService) {
    this.cargarHistorial();
  }

  cargarHistorial() {
    this.api.obtenerHistorialRecepciones(100).subscribe({
      next: (response) => {
        if (response.success) {
          this.historial = response.data;
          this.historialFiltrado = [...this.historial];
        } else {
          this.historial = [];
          this.historialFiltrado = [];
          this.mensaje = 'No hay historial disponible';
        }
      },
      error: () => {
        this.historial = [];
        this.historialFiltrado = [];
        this.mensaje = 'Error al cargar historial';
      }
    });
  }

  /**
   * Filtrar historial según los criterios seleccionados
   */
  filtrarHistorial() {
    this.historialFiltrado = this.historial.filter(item => {
      const cumpleFecha = !this.filtroFecha || item.fecha_recepcion === this.filtroFecha;
      const cumpleUnidad = !this.filtroUnidadMedida || item.unidad_medida === this.filtroUnidadMedida;
      const cumpleTipo = !this.filtroTipoProducto || item.tipo_producto === this.filtroTipoProducto;
      
      return cumpleFecha && cumpleUnidad && cumpleTipo;
    });
  }

  /**
   * Limpiar todos los filtros
   */
  limpiarFiltros() {
    this.filtroFecha = '';
    this.filtroUnidadMedida = '';
    this.filtroTipoProducto = '';
    this.historialFiltrado = [...this.historial];
  }

  volver() {
    this.volverEvent.emit();
  }
}