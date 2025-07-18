import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-reportar-producto',
  templateUrl: './reportar-producto.html',
  styleUrls: ['./reportar-producto.css'],
  standalone: true,
  imports: [FormsModule, NgIf, NgFor, CurrencyPipe]
})
export class ReportarProducto {
  @Output() volverEvent = new EventEmitter<void>();
  
  form = {
    id_producto: null as number | null,
    tipo_reporte: '',
    descripcion: ''
  };
  
  // Nuevas propiedades para autocompletado
  terminoBusqueda = '';
  productosSugeridos: any[] = [];
  mostrarSugerencias = false;
  productoSeleccionado: any = null;
  
  tipos = ['Producto dañado', 'Producto faltante'];
  mensaje = '';
  id_empleado: string = localStorage.getItem('id_empleado') || '';

  constructor(private api: ApiService) {}

  /**
   * Buscar productos mientras se escribe
   */
  buscarProductos() {
    if (this.terminoBusqueda.length < 2) {
      this.productosSugeridos = [];
      this.mostrarSugerencias = false;
      return;
    }

    this.api.buscarProductosAutocompletado(this.terminoBusqueda).subscribe({
      next: (response) => {
        if (response.success) {
          this.productosSugeridos = response.data;
          this.mostrarSugerencias = true;
        } else {
          this.productosSugeridos = [];
          this.mostrarSugerencias = false;
        }
      },
      error: (error) => {
        console.error('Error al buscar productos:', error);
        this.productosSugeridos = [];
        this.mostrarSugerencias = false;
      }
    });
  }

  /**
   * Seleccionar producto de la lista
   */
  seleccionarProducto(producto: any) {
    this.productoSeleccionado = producto;
    this.form.id_producto = producto.id_producto;
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

  enviarReporte() {
    this.mensaje = '';
    
    if (!this.form.id_producto) {
      this.mensaje = '❌ Selecciona un producto de la lista.';
      return;
    }
    if (!this.form.tipo_reporte || !this.form.descripcion) {
      this.mensaje = '❌ Todos los campos son obligatorios.';
      return;
    }
    if (!this.id_empleado) {
      this.mensaje = '❌ No se detectó el empleado. Inicia sesión de nuevo.';
      return;
    }

    this.api.reportarProducto({
      id_producto: this.form.id_producto,
      id_empleado: this.id_empleado,
      tipo_reporte: this.form.tipo_reporte,
      descripcion: this.form.descripcion
    }).subscribe({
      next: () => {
        this.mensaje = '✅ Reporte enviado correctamente.';
        // Limpiar formulario
        this.form = { id_producto: null, tipo_reporte: '', descripcion: '' };
        this.terminoBusqueda = '';
        this.productoSeleccionado = null;
      },
      error: () => this.mensaje = '❌ Error al enviar el reporte.'
    });
  }

  volver() {
    this.volverEvent.emit();
  }
}