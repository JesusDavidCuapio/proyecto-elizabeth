import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface VentaCompleta {
  id_venta: number;
  fecha_venta: string;
  total: number;
  pago_cliente: number;
  cambio: number;
  empleado_nombre: string;
  productos: string;
  tipos_producto: string;
}

@Component({
  selector: 'app-ver-ventas',
  templateUrl: './ver-ventas.html',
  styleUrls: ['./ver-ventas.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, DatePipe, CurrencyPipe]
})
export class VerVentas implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();

  // Datos de ventas
  ventasRegistradas: VentaCompleta[] = [];
  ventasFiltradas: VentaCompleta[] = [];
  cargando = false;

  // Filtros administrativos (SIN MONTO)
  fechaInicio = '';
  fechaFin = '';
  filtroEmpleado = '';
  filtroTurno = '';
  filtroTipoVenta = '';

  // Opciones para filtros
  empleadosDisponibles: any[] = [];
  
  // Opciones predefinidas
  opcionesTurno = [
    { valor: 'mañana', etiqueta: 'Mañana (6:00 - 14:00)' },
    { valor: 'tarde', etiqueta: 'Tarde (14:00 - 22:00)' },
    { valor: 'noche', etiqueta: 'Noche (22:00 - 6:00)' }
  ];

  opcionesTipoVenta = [
    { valor: 'pequeña', etiqueta: 'Ventas Pequeñas (< $100)' },
    { valor: 'mediana', etiqueta: 'Ventas Medianas ($100 - $500)' },
    { valor: 'grande', etiqueta: 'Ventas Grandes (> $500)' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.cargarVentasRegistradas();
  }

  /**
   * Cargar ventas registradas con detalles
   */
  cargarVentasRegistradas() {
    this.cargando = true;
    this.api.obtenerVentasRegistradas().subscribe({
      next: (res: any) => {
        console.log('Respuesta de ventas:', res);
        if (res.success && res.data) {
          this.ventasRegistradas = res.data;
          this.ventasFiltradas = [...this.ventasRegistradas];
          this.cargarEmpleados();
          console.log('Ventas cargadas:', this.ventasRegistradas.length);
        } else {
          console.error('No se encontraron ventas o error en respuesta:', res);
          this.ventasRegistradas = [];
          this.ventasFiltradas = [];
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar ventas:', error);
        this.ventasRegistradas = [];
        this.ventasFiltradas = [];
        this.cargando = false;
      }
    });
  }

  /**
   * Cargar lista de empleados para el filtro
   */
  cargarEmpleados() {
    const empleadosUnicos = new Set<string>();
    this.ventasRegistradas.forEach(venta => {
      if (venta.empleado_nombre) {
        empleadosUnicos.add(venta.empleado_nombre);
      }
    });
    this.empleadosDisponibles = Array.from(empleadosUnicos)
      .map(nombre => ({ nombre }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  /**
   * Determinar el turno basado en la hora
   */
  private determinarTurno(fechaVenta: string): string {
    const fecha = new Date(fechaVenta);
    const hora = fecha.getHours();
    
    if (hora >= 6 && hora < 14) return 'mañana';
    if (hora >= 14 && hora < 22) return 'tarde';
    return 'noche';
  }

  /**
   * Determinar el tipo de venta basado en el monto
   */
  private determinarTipoVenta(total: number): string {
    if (total < 100) return 'pequeña';
    if (total <= 500) return 'mediana';
    return 'grande';
  }

  /**
   * Filtrar ventas según criterios seleccionados (SIN FILTRO DE MONTO)
   */
  filtrarVentas() {
    this.ventasFiltradas = this.ventasRegistradas.filter(venta => {
      // Filtro por rango de fechas
      let cumpleFecha = true;
      if (this.fechaInicio && this.fechaFin) {
        const fechaVenta = new Date(venta.fecha_venta).toISOString().split('T')[0];
        cumpleFecha = fechaVenta >= this.fechaInicio && fechaVenta <= this.fechaFin;
      }
      
      // Filtro por empleado
      const cumpleEmpleado = !this.filtroEmpleado || venta.empleado_nombre === this.filtroEmpleado;
      
      // Filtro por turno
      const cumpleTurno = !this.filtroTurno || this.determinarTurno(venta.fecha_venta) === this.filtroTurno;
      
      // Filtro por tipo de venta
      const cumpleTipoVenta = !this.filtroTipoVenta || this.determinarTipoVenta(venta.total) === this.filtroTipoVenta;
      
      return cumpleFecha && cumpleEmpleado && cumpleTurno && cumpleTipoVenta;
    });
  }

  /**
   * Limpiar todos los filtros (SIN MONTOS)
   */
  limpiarFiltros() {
    this.fechaInicio = '';
    this.fechaFin = '';
    this.filtroEmpleado = '';
    this.filtroTurno = '';
    this.filtroTipoVenta = '';
    this.ventasFiltradas = [...this.ventasRegistradas];
  }

  /**
   * MÉTODOS CORREGIDOS PARA ESTADÍSTICAS
   */

  calcularVentaMinima(): number {
    if (this.ventasFiltradas.length === 0) return 0;
    return Math.min(...this.ventasFiltradas.map(v => v.total));
  }

  calcularVentaMaxima(): number {
    if (this.ventasFiltradas.length === 0) return 0;
    return Math.max(...this.ventasFiltradas.map(v => v.total));
  }

  /**
   * TrackBy function para mejor performance
   */
  trackByFn(index: number, item: VentaCompleta): number {
    return item.id_venta;
  }

  volver() {
    this.volverEvent.emit();
  }
}