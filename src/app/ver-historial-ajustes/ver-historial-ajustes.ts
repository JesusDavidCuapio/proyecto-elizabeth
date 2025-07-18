import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface HistorialAjuste {
  id_movimiento: number;
  codigo: string;
  producto_nombre: string;
  tipo_producto: string;
  unidad_medida: string;
  tipo_movimiento: string;
  cantidad: number;
  motivo: string;
  empleado_nombre: string;
  fecha_movimiento: string;
}

@Component({
  selector: 'app-ver-historial-ajustes',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './ver-historial-ajustes.html',
  styleUrls: ['./ver-historial-ajustes.css']
})
export class VerHistorialAjustes implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();

  // Datos del historial
  historial: HistorialAjuste[] = [];
  historialFiltrado: HistorialAjuste[] = [];
  cargando = false;

  // Filtros
  filtroFecha = '';
  filtroUnidadMedida = '';
  filtroTipoProducto = '';

  // Opciones para filtros
  tiposUnidad = ['Piezas', 'Paquete', 'kg', 'Gramos', 'Por caja'];
  tiposProducto = ['Abarrotes', 'Lácteos', 'Huevos', 'Bebida', 'Botanas - frituras', 'Dulces', 'Higiene personal', 'Limpieza'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  /**
   * Cargar historial de ajustes
   */
  cargarHistorial() {
    this.cargando = true;
    this.apiService.obtenerHistorialAjustes(100).subscribe({
      next: (response) => {
        if (response.success) {
          this.historial = response.data;
          this.historialFiltrado = [...this.historial];
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
        this.cargando = false;
      }
    });
  }

  /**
   * Filtrar historial según los criterios seleccionados
   */
  filtrarHistorial() {
    this.historialFiltrado = this.historial.filter(item => {
      const cumpleFecha = !this.filtroFecha || item.fecha_movimiento.includes(this.filtroFecha);
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

  /**
   * TrackBy function para mejor performance en *ngFor
   */
  trackByFn(index: number, item: HistorialAjuste): number {
    return item.id_movimiento;
  }

  /**
   * Volver al panel anterior
   */
  volver() {
    this.volverEvent.emit();
  }
} // <- Cierre de la clase DEBE estar aquí

// NO DEBE HABER NADA MÁS DESPUÉS DE ESTA LLAVE

