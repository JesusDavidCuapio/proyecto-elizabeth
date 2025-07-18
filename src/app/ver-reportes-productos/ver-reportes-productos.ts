import { Component, Output, EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ver-reportes-productos',
  templateUrl: './ver-reportes-productos.html',
  styleUrls: ['./ver-reportes-productos.css'],
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule]
})
export class VerReportesProductos {
  reportes: any[] = [];
  reportesFiltrados: any[] = [];
  mensaje = '';

  // Filtros
  filtroTipoReporte = '';
  filtroFecha = '';
  filtroTipoProducto = '';

  // Tipos disponibles
  tiposReporte = ['Producto dañado', 'Producto faltante'];
  tiposProducto = ['Abarrotes', 'Lácteos', 'Huevos', 'Bebida', 'Botanas - frituras', 'Dulces', 'Higiene personal', 'Limpieza'];

  @Output() volverEvent = new EventEmitter<void>();

  constructor(private api: ApiService) {
    this.cargarReportes();
  }

  cargarReportes() {
    this.api.obtenerReportesProductos().subscribe({
      next: (res: any) => {
        if (res.success && res.data.length) {
          this.reportes = res.data;
          this.reportesFiltrados = [...this.reportes];
        } else {
          this.reportes = [];
          this.reportesFiltrados = [];
          this.mensaje = 'No hay reportes registrados';
        }
      },
      error: () => {
        this.reportes = [];
        this.reportesFiltrados = [];
        this.mensaje = 'Error al cargar reportes';
      }
    });
  }

  /**
   * Filtrar reportes según los criterios seleccionados
   */
  filtrarReportes() {
    this.reportesFiltrados = this.reportes.filter(reporte => {
      const cumpleTipoReporte = !this.filtroTipoReporte || reporte.tipo_reporte === this.filtroTipoReporte;
      const cumpleFecha = !this.filtroFecha || reporte.fecha_reporte === this.filtroFecha;
      const cumpleTipoProducto = !this.filtroTipoProducto || reporte.tipo_producto === this.filtroTipoProducto;
      
      return cumpleTipoReporte && cumpleFecha && cumpleTipoProducto;
    });
  }

  /**
   * Limpiar todos los filtros
   */
  limpiarFiltros() {
    this.filtroTipoReporte = '';
    this.filtroFecha = '';
    this.filtroTipoProducto = '';
    this.reportesFiltrados = [...this.reportes];
  }

  volver() {
    this.volverEvent.emit();
  }
}