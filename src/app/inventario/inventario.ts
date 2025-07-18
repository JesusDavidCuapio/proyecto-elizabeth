import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, CurrencyPipe, NgIf } from '@angular/common';
import { ApiService } from '../services/api.service';

interface ProductoInventario {
  id: number;
  codigo: string;
  nombre: string;
  tipo_producto: string;
  precio: number;
  cantidad: number;
  stock_minimo: number;
  unidad_medida: string;
  fecha_creacion: string;
  estado_stock: string;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, NgFor, CurrencyPipe, NgIf],
  templateUrl: './inventario.html',
  styleUrls: ['./inventario.css']
})
export class Inventario implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();
  
  filtro = '';
  filtroTipo = '';
  filtroEstado = '';

  // Tipos fijos y claros
  tiposDisponibles = [
  'Abarrotes',
  'Lacteos',
  'Huevos',
  'Bebida',
  'Botanas - frituras',
  'Dulces',
  'Higiene personal',
  'Limpieza',
  'otros'
];

  productos: ProductoInventario[] = [];
  productosFiltrados: ProductoInventario[] = [];
  cargando = false;
  mensaje = '';
  productosBajoStock = 0;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarInventario();
  }

  cargarInventario() {
    this.cargando = true;
    this.mensaje = '';

    this.apiService.getInventario().subscribe({
      next: (response) => {
        if (response.success) {
          this.productos = response.data;
          this.productosFiltrados = [...this.productos];
          this.calcularEstadisticas();
          this.mensaje = '';
        } else {
          this.mensaje = '❌ Error al cargar inventario';
          this.productos = [];
          this.productosFiltrados = [];
        }
        this.cargando = false;
      },
      error: (error) => {
        this.mensaje = '❌ Error de conexión con la base de datos';
        this.productos = [];
        this.productosFiltrados = [];
        this.cargando = false;
      }
    });
  }

  calcularEstadisticas() {
    this.productosBajoStock = this.productos.filter(p => p.estado_stock === 'Bajo stock').length;
  }

  filtrarProductos() {
    let filtrados = [...this.productos];

    // Filtro por nombre o código
    if (this.filtro.trim()) {
      const termino = this.filtro.toLowerCase();
      filtrados = filtrados.filter(producto =>
        producto.nombre.toLowerCase().includes(termino) ||
        producto.codigo.toLowerCase().includes(termino)
      );
    }

    // Filtro por tipo de producto
    if (this.filtroTipo) {
      filtrados = filtrados.filter(producto => producto.tipo_producto === this.filtroTipo);
    }

    // Filtro por estado de stock
    if (this.filtroEstado) {
      filtrados = filtrados.filter(producto => producto.estado_stock === this.filtroEstado);
    }

    this.productosFiltrados = filtrados;
  }

  volver() {
    this.volverEvent.emit();
  }
}