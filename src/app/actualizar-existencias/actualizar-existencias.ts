import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CurrencyPipe, DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

interface Producto {
  id_producto: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  unidad_medida: string;
  tipo_producto: string;
  estado_stock: string;
}

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
  selector: 'app-actualizar-existencias',
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CurrencyPipe, DatePipe],
  templateUrl: './actualizar-existencias.html',
  styleUrls: ['./actualizar-existencias.css']
})
export class ActualizarExistencias implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();
 @Output() verHistorialEvent = new EventEmitter<void>();

  // Datos del formulario
  productoSeleccionado: Producto | null = null;
  tipoAjuste: 'aumentar' | 'reducir' | 'establecer' = 'aumentar';
  cantidad: number | null = null;
  motivo = '';
  observaciones = '';

  // Búsqueda de productos
  terminoBusqueda = '';
  productosSugeridos: Producto[] = [];
  mostrarSugerencias = false;

  // Estados del componente
  cargando = false;
  mensaje = '';
  
  // Historial
  historial: HistorialAjuste[] = [];
  mostrarHistorial = false;

   // Filtros para historial
  filtroFecha = '';
  filtroUnidadMedida = '';
  filtroTipoProducto = '';
  historialFiltrado: HistorialAjuste[] = [];

  // Opciones para filtros
  tiposUnidad = ['Piezas', 'Paquete', 'kg', 'Gramos', 'Por caja'];
  tiposProducto = ['Abarrotes', 'Lácteos', 'Huevos', 'Bebida', 'Botanas - frituras', 'Dulces', 'Higiene personal', 'Limpieza'];

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarHistorial();
  }

  /**
   * Buscar productos para selección
   */
  buscarProductos() {
    if (this.terminoBusqueda.length < 2) {
      this.productosSugeridos = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.apiService.buscarProductosParaActualizar(this.terminoBusqueda).subscribe({
      next: (response) => {
        if (response.success) {
          this.productosSugeridos = response.data;
          this.mostrarSugerencias = true;
        }
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
      }
    });
  }

  /**
   * Seleccionar producto de la lista
   */
  seleccionarProducto(producto: Producto) {
    this.productoSeleccionado = producto;
    this.terminoBusqueda = `${producto.codigo} - ${producto.nombre}`;
    this.mostrarSugerencias = false;
    this.productosSugeridos = [];
    this.mensaje = `✅ Producto seleccionado: ${producto.nombre}`;
  }

  /**
   * Ocultar sugerencias
   */
  ocultarSugerencias() {
    setTimeout(() => {
      this.mostrarSugerencias = false;
    }, 200);
  }

  /**
   * Calcular el nuevo stock según el tipo de ajuste
   */
  calcularNuevoStock(): number {
    if (!this.productoSeleccionado || !this.cantidad) return 0;

    switch (this.tipoAjuste) {
      case 'aumentar':
        return this.productoSeleccionado.stock_actual + this.cantidad;
      case 'reducir':
        return Math.max(0, this.productoSeleccionado.stock_actual - this.cantidad);
      case 'establecer':
        return this.cantidad;
      default:
        return this.productoSeleccionado.stock_actual;
    }
  }

  /**
   * Actualizar existencias
   */
  actualizarExistencias() {
    if (!this.validarDatos()) return;

    this.cargando = true;
    this.mensaje = '';

    const empleadoData = this.authService.getEmpleadoData();
    if (!empleadoData) {
      this.mensaje = '❌ Error: No hay empleado autenticado';
      this.cargando = false;
      return;
    }

    const datos = {
      id_producto: this.productoSeleccionado!.id_producto,
      tipo_ajuste: this.tipoAjuste,
      cantidad: this.cantidad,
      motivo: this.motivo,
      observaciones: this.observaciones,
      id_empleado: empleadoData.id
    };

    this.apiService.actualizarExistencias(datos).subscribe({
      next: (response) => {
        if (response.success) {
          const resultado = response.data;
          this.mensaje = `✅ Existencias actualizadas: ${resultado.producto.nombre} 
                         (${resultado.ajuste.stock_anterior} → ${resultado.ajuste.stock_nuevo})`;
          this.limpiarFormulario();
          this.cargarHistorial();
          setTimeout(() => this.mensaje = '', 5000);
        } else {
          this.mensaje = '❌ Error al actualizar existencias: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al actualizar existencias:', error);
        this.mensaje = '❌ Error al procesar la actualización';
        this.cargando = false;
      }
    });
  }

  /**
   * Validar datos del formulario
   */
  validarDatos(): boolean {
    if (!this.productoSeleccionado) {
      this.mensaje = '❌ Seleccione un producto';
      return false;
    }

    if (!this.cantidad || this.cantidad < 0) {
      this.mensaje = '❌ La cantidad debe ser mayor o igual a 0';
      return false;
    }

    if (!this.motivo.trim()) {
      this.mensaje = '❌ El motivo es requerido';
      return false;
    }

    if (this.motivo.trim().length < 5) {
      this.mensaje = '❌ El motivo debe tener al menos 5 caracteres';
      return false;
    }

    // Validar que no se reduzca más stock del disponible
    if (this.tipoAjuste === 'reducir' && this.cantidad > this.productoSeleccionado.stock_actual) {
      this.mensaje = `❌ No se puede reducir más de ${this.productoSeleccionado.stock_actual} unidades disponibles`;
      return false;
    }

    return true;
  }

  /**
   * Cargar historial de ajustes
   */
  cargarHistorial() {
    this.apiService.obtenerHistorialAjustes(30).subscribe({
      next: (response) => {
        if (response.success) {
          this.historial = response.data;
        }
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
      }
    });
  }

  /**
   * Ir a historial completo
   */
  alternarHistorial() {
    this.verHistorialEvent.emit();
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
   * Limpiar formulario
   */
  limpiarFormulario() {
    this.productoSeleccionado = null;
    this.tipoAjuste = 'aumentar';
    this.cantidad = null;
    this.motivo = ''; // Se limpia como string vacío
    this.observaciones = '';
    this.terminoBusqueda = '';
    this.productosSugeridos = [];
    this.mostrarSugerencias = false;
  }

  /**
   * Cancelar operación
   */
  cancelar() {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  /**
   * Volver al panel anterior
   */
  volver() {
    this.volverEvent.emit();
  }
}