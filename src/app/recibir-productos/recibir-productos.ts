import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

interface ProductoExistente {
  id_producto: number;
  codigo: string;
  nombre: string;
  precio: number;
  stock_actual: number;
  stock_minimo: number;
  unidad_medida: string;
  tipo_producto: string;
}

interface HistorialRecepcion {
  id_recepcion: number;
  codigo: string;
  producto_nombre: string;
  cantidad_recibida: number;
  fecha_recepcion: string;
  observaciones: string;
  empleado_nombre: string;
  fecha_registro: string;
  unidad_medida: string;
  tipo_producto: string;
}

@Component({
  selector: 'app-recibir-productos',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './recibir-productos.html',
  styleUrls: ['./recibir-productos.css']
})
export class RecibirProductos implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() verHistorialEvent = new EventEmitter<void>();

  // Nuevas propiedades para validación de código
  mensajeCodigoValidacion = '';
  codigoSugerido = '';
  validandoCodigo = false;

  // Datos del formulario
  codigo = '';
  nombre = '';
  precio: number | null = null;
  cantidad: number | null = null;
  stockMinimo: number | null = null;
  fechaRecepcion = '';
  observaciones = '';
  
  // Nuevos campos
  unidadMedida = '';
  tipoProducto = '';

  // Opciones para selects
  tiposUnidad = ['Piezas', 'Paquete', 'kg', 'Gramos', 'Por caja'];
  tiposProducto = ['Abarrotes', 'Lácteos', 'Huevos', 'Bebida', 'Botanas - frituras', 'Dulces', 'Higiene personal', 'Limpieza'];

  // Estados del componente
  cargando = false;
  verificandoProducto = false;
  mensaje = '';
  tipoFormulario: 'buscar' | 'producto-existente' | 'producto-nuevo' = 'buscar';
  
  // Datos del producto encontrado
  productoExistente: ProductoExistente | null = null;
  
    // Historial de recepciones
  historial: HistorialRecepcion[] = [];
  mostrarHistorial = false;
  
  // AGREGAR ESTA LÍNEA:
  historialFiltrado: HistorialRecepcion[] = [];

  // Autocompletado
  productosSugeridos: any[] = [];
  mostrarSugerencias = false;
  terminoBusqueda = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Establecer fecha actual por defecto
    const hoy = new Date();
    this.fechaRecepcion = hoy.toISOString().split('T')[0];
    
    // Cargar historial inicial
    this.cargarHistorial();
  }

  /**
   * Buscar productos mientras se escribe
   */
  buscarProductosDinamico() {
    this.terminoBusqueda = this.codigo;
    
    if (this.terminoBusqueda.length < 2) {
      this.productosSugeridos = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.apiService.buscarProductosAutocompletado(this.terminoBusqueda).subscribe({
      next: (response) => {
        if (response.success) {
          this.productosSugeridos = response.data;
          // Mostrar sugerencias siempre que se haya buscado algo
          this.mostrarSugerencias = true;
        } else {
          this.productosSugeridos = [];
          this.mostrarSugerencias = true; // Mostrar para poder crear nuevo
        }
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
        this.productosSugeridos = [];
        this.mostrarSugerencias = true; // Mostrar para poder crear nuevo
      }
    });
  }

  /**
   * Seleccionar producto de la lista
   */
  seleccionarProducto(producto: any) {
    this.productoExistente = producto;
    this.codigo = producto.codigo;
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.tipoFormulario = 'producto-existente';
    this.mostrarSugerencias = false;
    this.productosSugeridos = [];
    this.mensaje = `✅ Producto seleccionado: ${producto.nombre}`;
  }

  /**
   * Crear producto nuevo desde búsqueda
   */
  mostrarFormularioNuevo() {
    this.productoExistente = null;
    this.tipoFormulario = 'producto-nuevo';
    this.nombre = '';
    this.precio = null;
    this.stockMinimo = 5;
    this.unidadMedida = '';
    this.tipoProducto = '';
    this.mostrarSugerencias = false;
    this.productosSugeridos = [];
    
    // Conservar el código que se estaba buscando
    // this.codigo ya tiene el valor correcto
    
    this.mensaje = '';
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
   * Recibir producto existente (aumentar stock)
   */
  recibirProductoExistente() {
    if (!this.validarDatosBasicos()) return;

    this.cargando = true;
    this.mensaje = '';

    const empleadoData = this.authService.getEmpleadoData();
    if (!empleadoData) {
      this.mensaje = '❌ Error: No hay empleado autenticado';
      this.cargando = false;
      return;
    }

    const datos = {
      codigo: this.codigo.toUpperCase(),
      cantidad_recibida: this.cantidad,
      fecha_recepcion: this.fechaRecepcion,
      observaciones: this.observaciones,
      id_empleado: empleadoData.id
    };

    this.apiService.recibirProductoExistente(datos).subscribe({
      next: (response) => {
        if (response.success) {
          this.mensaje = `✅ Stock actualizado: ${response.data.producto} (+${response.data.cantidad_recibida} unidades)`;
          this.limpiarFormulario();
          this.cargarHistorial();
          setTimeout(() => this.mensaje = '', 4000);
        } else {
          this.mensaje = '❌ Error al recibir producto: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al recibir producto:', error);
        this.mensaje = '❌ Error al procesar la recepción';
        this.cargando = false;
      }
    });
  }

  /**
   * Crear producto nuevo
   */
  crearProductoNuevo() {
    if (!this.validarDatosCompletos()) return;

    this.cargando = true;
    this.mensaje = '';

    const empleadoData = this.authService.getEmpleadoData();
    if (!empleadoData) {
      this.mensaje = '❌ Error: No hay empleado autenticado';
      this.cargando = false;
      return;
    }

    const datos = {
      codigo: this.codigo.toUpperCase(),
      nombre: this.nombre,
      precio: this.precio,
      cantidad_inicial: this.cantidad,
      stock_minimo: this.stockMinimo || 5,
      unidad_medida: this.unidadMedida,
      tipo_producto: this.tipoProducto,
      fecha_recepcion: this.fechaRecepcion,
      observaciones: this.observaciones,
      id_empleado: empleadoData.id
    };

    this.apiService.crearProductoNuevo(datos).subscribe({
      next: (response) => {
        if (response.success) {
          this.mensaje = `✅ Producto creado: ${response.data.nombre} (${response.data.stock_inicial} unidades)`;
          this.limpiarFormulario();
          setTimeout(() => this.mensaje = '', 4000);
        } else {
          this.mensaje = '❌ Error al crear producto: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al crear producto:', error);
        this.mensaje = '❌ Error al crear el producto';
        this.cargando = false;
      }
    });
  }

  /**
   * Validar datos completos para producto nuevo
   */
  validarDatosCompletos(): boolean {
    if (!this.validarDatosBasicos()) return false;

    if (!this.nombre.trim()) {
      this.mensaje = '❌ Nombre del producto requerido';
      return false;
    }

    if (!this.precio || this.precio <= 0) {
      this.mensaje = '❌ Precio debe ser mayor a 0';
      return false;
    }

    if (!this.unidadMedida) {
      this.mensaje = '❌ Selecciona un tipo de unidad';
      return false;
    }

    if (!this.tipoProducto) {
      this.mensaje = '❌ Selecciona un tipo de producto';
      return false;
    }

    return true;
  }

  /**
   * Cargar historial de recepciones
   */
  cargarHistorial() {
    this.apiService.obtenerHistorialAjustes(30).subscribe({
      next: (response) => {
        if (response.success) {
          this.historial = response.data;
          this.historialFiltrado = [...this.historial];
        }
      },
      error: (error) => {
        console.error('Error al cargar historial:', error);
      }
    });
  }

  /**
   * Validar datos básicos
   */
  validarDatosBasicos(): boolean {
    if (!this.codigo.trim()) {
      this.mensaje = '❌ Código de producto requerido';
      return false;
    }

    if (!this.cantidad || this.cantidad <= 0) {
      this.mensaje = '❌ Cantidad debe ser mayor a 0';
      return false;
    }

    if (!this.fechaRecepcion) {
      this.mensaje = '❌ Fecha de recepción requerida';
      return false;
    }

    return true;
  }

  /**
   * Validar código en tiempo real
   */
  validarCodigoEnTiempoReal() {
    if (!this.codigo.trim()) {
      this.mensajeCodigoValidacion = '';
      this.codigoSugerido = '';
      return;
    }

    if (this.codigo.length < 3) {
      this.mensajeCodigoValidacion = '💡 Mínimo 3 caracteres';
      return;
    }

    this.validandoCodigo = true;
    this.mensajeCodigoValidacion = '⏳ Verificando código...';

    this.apiService.verificarCodigo(this.codigo).subscribe({
      next: (response) => {
        this.validandoCodigo = false;
        if (response.success) {
          if (response.data.existe) {
            this.mensajeCodigoValidacion = `❌ Código ya existe. Sugerencia: ${response.data.codigoSugerido}`;
            this.codigoSugerido = response.data.codigoSugerido;
          } else {
            this.mensajeCodigoValidacion = '✅ Código disponible';
            this.codigoSugerido = '';
          }
        }
      },
      error: () => {
        this.validandoCodigo = false;
        this.mensajeCodigoValidacion = '❌ Error al verificar código';
      }
    });
  }

  /**
   * Usar código sugerido
   */
  usarCodigoSugerido() {
    if (this.codigoSugerido) {
      this.codigo = this.codigoSugerido;
      this.validarCodigoEnTiempoReal();
    }
  }

  /**
   * Limpiar formulario - actualizado
   */
  limpiarFormulario() {
    this.codigo = '';
    this.nombre = '';
    this.precio = null;
    this.cantidad = null;
    this.stockMinimo = null;
    this.observaciones = '';
    this.unidadMedida = '';
    this.tipoProducto = '';
    this.productoExistente = null;
    this.tipoFormulario = 'buscar';
    this.productosSugeridos = [];
    this.mostrarSugerencias = false;
    this.terminoBusqueda = '';
    
    // Limpiar validación de código
    this.mensajeCodigoValidacion = '';
    this.codigoSugerido = '';
    this.validandoCodigo = false;
    
    // Mantener fecha actual
    const hoy = new Date();
    this.fechaRecepcion = hoy.toISOString().split('T')[0];
  }

  /**
   * Cancelar operación
   */
  cancelar() {
    this.limpiarFormulario();
    this.mensaje = '';
  }

  /**
   * Mostrar historial
   */
  mostrarHistorialCompleto() {
    this.verHistorialEvent.emit();
  }

  /**
   * Volver al panel anterior
   */
  volver() {
    this.volverEvent.emit();
  }
}