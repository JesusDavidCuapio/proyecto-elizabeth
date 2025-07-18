import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, CurrencyPipe, NgIf, DecimalPipe, DatePipe } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-registrar-venta',
  standalone: true,
  imports: [FormsModule, NgFor, CurrencyPipe, NgIf, DecimalPipe, DatePipe],
  templateUrl: './registrar-venta.html',
  styleUrls: ['./registrar-venta.css']
})
export class RegistrarVenta implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();
  
  // Propiedades del componente
  productos: any[] = [];
  productosDisponibles: any[] = [];
  carrito: any[] = [];
  busqueda = '';
  total = 0;
  pagoCliente: number | null = null;
  cambio = 0;
  mostrandoPago = false;
  empleadoId = 'EMP001'; // Valor por defecto (se reemplaza con datos reales)
  mensaje = '';
  cargando = false;
  procesandoVenta = false;
  fechaActual = new Date();

  constructor(
    private apiService: ApiService, 
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarProductos();
    this.verificarAutenticacion();
  }

  /**
   * Verificar si hay un empleado autenticado
   */
  verificarAutenticacion() {
    const datosEmpleado = this.authService.getEmpleadoData();
    if (!datosEmpleado) {
      this.mensaje = '⚠️ Advertencia: No hay empleado autenticado';
      console.warn('No hay empleado autenticado');
    } else {
      console.log('Empleado autenticado:', datosEmpleado);
    }
  }

  /**
   * Cargar productos desde el API
   */
  cargarProductos() {
    this.cargando = true;
    this.mensaje = '';
    
    this.apiService.getInventario().subscribe({
      next: (response) => {
        if (response.success) {
          this.productos = response.data;
          this.productosDisponibles = [...this.productos];
          this.mensaje = '';
          console.log('Productos cargados:', this.productos.length);
        } else {
          this.mensaje = '❌ Error al cargar productos: ' + response.message;
          console.error('Error en respuesta:', response);
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.mensaje = '❌ Error de conexión al cargar productos';
        this.cargando = false;
      }
    });
  }

  /**
   * Buscar productos por nombre o código
   */
  buscarProductos() {
    if (!this.busqueda.trim()) {
      this.productosDisponibles = [...this.productos];
      return;
    }

    const termino = this.busqueda.toLowerCase();
    this.productosDisponibles = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(termino) ||
      producto.codigo.toLowerCase().includes(termino)
    );
    
    console.log(`Búsqueda "${termino}": ${this.productosDisponibles.length} productos encontrados`);
  }

  /**
   * Agregar producto al carrito
   */
  agregarAlCarrito(producto: any) {
    // Verificar si el producto tiene stock
    if (producto.cantidad <= 0) {
      this.mensaje = `❌ ${producto.nombre} no tiene stock disponible`;
      setTimeout(() => this.mensaje = '', 3000);
      return;
    }

    // Buscar si el producto ya está en el carrito
    const itemExistente = this.carrito.find(item => item.id === producto.id);
    
    if (itemExistente) {
      // Si ya existe, aumentar cantidad si hay stock
      if (itemExistente.cantidad < producto.cantidad) {
        itemExistente.cantidad++;
        this.calcularTotal();
        this.mensaje = `✅ ${producto.nombre} agregado al carrito`;
        setTimeout(() => this.mensaje = '', 2000);
      } else {
        this.mensaje = `❌ Stock insuficiente para ${producto.nombre}`;
        setTimeout(() => this.mensaje = '', 3000);
      }
    } else {
      // Si no existe, agregarlo al carrito
      this.carrito.push({
        id: producto.id,
        codigo: producto.codigo,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1,
        stockDisponible: producto.cantidad,
        unidad_medida: producto.unidad_medida,
        tipo_producto: producto.tipo_producto
      });
      this.calcularTotal();
      this.mensaje = `✅ ${producto.nombre} agregado al carrito`;
      setTimeout(() => this.mensaje = '', 2000);
    }
    
    console.log('Carrito actualizado:', this.carrito);
  }

  /**
   * Eliminar producto del carrito
   */
  eliminarDelCarrito(index: number) {
    const producto = this.carrito[index];
    this.carrito.splice(index, 1);
    this.calcularTotal();
    this.mensaje = `🗑️ ${producto.nombre} eliminado del carrito`;
    setTimeout(() => this.mensaje = '', 2000);
    console.log('Producto eliminado del carrito:', producto.nombre);
  }

  /**
   * Actualizar cantidad de un producto en el carrito
   */
  actualizarCantidad(item: any, cantidad: number) {
    // Convertir a número entero
    const nuevaCantidad = Math.floor(Number(cantidad));
    
    // Si la cantidad es 0 o negativa, eliminar del carrito
    if (nuevaCantidad <= 0) {
      const index = this.carrito.indexOf(item);
      this.eliminarDelCarrito(index);
      return;
    }

    // Verificar si la nueva cantidad no excede el stock
    if (nuevaCantidad <= item.stockDisponible) {
      item.cantidad = nuevaCantidad;
      this.calcularTotal();
      console.log(`Cantidad actualizada: ${item.nombre} -> ${nuevaCantidad}`);
    } else {
      // Restaurar la cantidad anterior si excede el stock
      item.cantidad = Math.min(item.cantidad, item.stockDisponible);
      this.mensaje = `❌ Stock insuficiente para ${item.nombre}. Máximo: ${item.stockDisponible}`;
      setTimeout(() => this.mensaje = '', 3000);
    }
  }

  /**
   * Calcular total del carrito
   */
  calcularTotal() {
    this.total = this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    this.calcularCambio();
  }

  /**
   * Calcular cambio cuando cambia el pago del cliente
   */
  calcularCambio() {
    if (this.pagoCliente && this.pagoCliente >= this.total) {
      this.cambio = this.pagoCliente - this.total;
    } else {
      this.cambio = 0;
    }
  }

  /**
   * Mostrar panel de pago
   */
  mostrarPanelPago() {
    if (this.carrito.length === 0) {
      this.mensaje = '❌ No hay productos en el carrito';
      return;
    }
    this.mostrandoPago = true;
    this.pagoCliente = null;
    this.cambio = 0;
  }

  /**
   * Cancelar pago
   */
  cancelarPago() {
    this.mostrandoPago = false;
    this.pagoCliente = null;
    this.cambio = 0;
  }

  /**
   * Procesar venta con mensaje emergente
   */
  procesarVenta() {
    // Validaciones existentes...
    if (this.carrito.length === 0) {
      this.mensaje = '❌ No hay productos en el carrito';
      return;
    }

    if (!this.pagoCliente || this.pagoCliente < this.total) {
      this.mensaje = '❌ El pago del cliente debe ser mayor o igual al total';
      return;
    }

    this.procesandoVenta = true;
    this.mensaje = '';

    // Obtener datos del empleado autenticado
    const datosEmpleado = this.authService.getEmpleadoData();
    
    if (!datosEmpleado || !datosEmpleado.id) {
      this.mensaje = '❌ Error: No hay empleado autenticado. Inicie sesión nuevamente.';
      this.procesandoVenta = false;
      return;
    }

    // Preparar datos de la venta
    const ventaData = {
      empleado_id: datosEmpleado.id,
      productos: this.carrito.map(item => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre,
        precio: item.precio,
        cantidad: item.cantidad
      })),
      total: this.total,
      pago_cliente: this.pagoCliente
    };

    this.apiService.registrarVenta(ventaData).subscribe({
      next: (response) => {
        if (response.success) {
          // MOSTRAR MENSAJE EMERGENTE
          const resumenVenta = `
🎉 ¡VENTA COMPLETADA EXITOSAMENTE! 🎉

💰 Total: $${this.total.toFixed(2)}
💵 Pago recibido: $${this.pagoCliente!.toFixed(2)}
💸 Cambio: $${this.cambio.toFixed(2)}

📦 Productos vendidos: ${this.carrito.length}
👤 Cajero: ${datosEmpleado.nombre}
📅 Fecha: ${new Date().toLocaleString()}

¡Gracias por su compra!
          `;

          alert(resumenVenta);
          
          this.mensaje = `✅ Venta registrada exitosamente. Cambio: $${this.cambio.toFixed(2)}`;
          this.limpiarCarrito();
          this.mostrandoPago = false;
          
          // Recargar productos para actualizar stock
          setTimeout(() => {
            this.cargarProductos();
          }, 1000);
          
          // Limpiar mensaje después de 5 segundos
          setTimeout(() => this.mensaje = '', 5000);
        } else {
          this.mensaje = `❌ ${response.message || 'Error al procesar la venta'}`;
        }
        this.procesandoVenta = false;
      },
      error: (error) => {
        console.error('Error al procesar venta:', error);
        this.mensaje = '❌ Error al procesar la venta';
        this.procesandoVenta = false;
      }
    });
  }

  /**
   * Limpiar carrito
   */
  limpiarCarrito() {
    this.carrito = [];
    this.calcularTotal();
    this.mensaje = '🧹 Carrito limpiado';
    setTimeout(() => this.mensaje = '', 2000);
  }

  /**
   * Obtener información del empleado actual
   */
  obtenerEmpleadoInfo() {
    const datosEmpleado = this.authService.getEmpleadoData();
    return datosEmpleado || { nombre: 'No autenticado', cargo: 'N/A' };
  }

  /**
   * Volver al panel anterior
   */
  volver() {
    // Limpiar datos antes de volver
    this.mensaje = '';
    this.busqueda = '';
    this.productosDisponibles = [];
    this.volverEvent.emit();
  }

  /**
   * TrackBy function para mejor performance en *ngFor
   */
  trackByFn(index: number, item: any): number {
    return item.id || index;
  }

  /**
   * Método para debugging - mostrar estado actual
   */
  mostrarEstado() {
    console.log('=== ESTADO ACTUAL ===');
    console.log('Productos cargados:', this.productos.length);
    console.log('Productos disponibles:', this.productosDisponibles.length);
    console.log('Carrito:', this.carrito);
    console.log('Total:', this.total);
    console.log('Empleado:', this.authService.getEmpleadoData());
    console.log('Búsqueda:', this.busqueda);
  }
}