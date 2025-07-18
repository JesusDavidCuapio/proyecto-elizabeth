import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { NgIf, NgFor, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface Empleado {
  id_empleado: string;
  nombre_completo: string;
  usuario: string;
  telefono: string;
  cargo: string;
  fecha_creacion: string;
  activo: number;
  estado: string;
}

@Component({
  selector: 'app-gestionar-empleados',
  standalone: true,
  imports: [NgIf, NgFor, DatePipe, FormsModule],
  templateUrl: './gestionar-empleados.html',
  styleUrls: ['./gestionar-empleados.css']
})
export class GestionarEmpleados implements OnInit {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() agregarEmpleado = new EventEmitter<void>();

  empleados: Empleado[] = [];
  empleadosFiltrados: Empleado[] = [];
  empleadoEditando: Empleado | null = null;
  mensaje = '';
  cargando = false;
  mostrarModalEditar = false;

  // Filtros
  filtroCargoActual = 'Todos';
  terminoBusqueda = '';

  // Datos del empleado para edición
  empleadoEditar = {
    id_empleado: '',
    nombre_completo: '',
    usuario: '',
    telefono: '',
    cargo: 'Cajero'
  };

  // Confirmación de eliminación
  mostrarConfirmacion = false;
  empleadoAEliminar: Empleado | null = null;

  cargosDisponibles = ['Cajero', 'Auxiliar', 'Almacenista', 'Administrador'];

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.cargarEmpleados();
  }

  /**
   * Cargar empleados desde la API
   */
  cargarEmpleados() {
    this.cargando = true;
    this.mensaje = '';

    this.apiService.obtenerEmpleados().subscribe({
      next: (response) => {
        if (response.success) {
          this.empleados = response.data;
          this.empleadosFiltrados = [...this.empleados];
          this.mensaje = '';
          console.log('Empleados cargados:', this.empleados.length);
        } else {
          this.mensaje = '❌ Error al cargar empleados: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
        this.mensaje = '❌ Error de conexión al cargar empleados';
        this.cargando = false;
      }
    });
  }

  /**
   * Buscar empleados
   */
  buscarEmpleados() {
    if (!this.terminoBusqueda.trim()) {
      this.aplicarFiltros();
      return;
    }

    this.cargando = true;
    this.apiService.buscarEmpleados(this.terminoBusqueda).subscribe({
      next: (response) => {
        if (response.success) {
          this.empleadosFiltrados = response.data;
        } else {
          this.mensaje = '❌ Error en la búsqueda: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al buscar empleados:', error);
        this.mensaje = '❌ Error en la búsqueda';
        this.cargando = false;
      }
    });
  }

  /**
   * Filtrar empleados por cargo
   */
  filtrarPorCargo(cargo: string) {
    this.filtroCargoActual = cargo;
    this.terminoBusqueda = '';

    if (cargo === 'Todos') {
      this.empleadosFiltrados = [...this.empleados];
      return;
    }

    this.cargando = true;
    this.apiService.filtrarEmpleadosPorCargo(cargo).subscribe({
      next: (response) => {
        if (response.success) {
          this.empleadosFiltrados = response.data;
        } else {
          this.mensaje = '❌ Error al filtrar: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al filtrar empleados:', error);
        this.mensaje = '❌ Error al filtrar empleados';
        this.cargando = false;
      }
    });
  }

  /**
   * Aplicar filtros locales
   */
  aplicarFiltros() {
    let empleadosFiltrados = [...this.empleados];

    // Filtrar por cargo
    if (this.filtroCargoActual !== 'Todos') {
      empleadosFiltrados = empleadosFiltrados.filter(emp => emp.cargo === this.filtroCargoActual);
    }

    // Filtrar por búsqueda
    if (this.terminoBusqueda.trim()) {
      const termino = this.terminoBusqueda.toLowerCase();
      empleadosFiltrados = empleadosFiltrados.filter(emp =>
        emp.nombre_completo.toLowerCase().includes(termino) ||
        emp.usuario.toLowerCase().includes(termino)
      );
    }

    this.empleadosFiltrados = empleadosFiltrados;
  }

  /**
   * Abrir modal para editar empleado
   */
  editarEmpleado(empleado: Empleado) {
    this.empleadoEditar = {
      id_empleado: empleado.id_empleado,
      nombre_completo: empleado.nombre_completo,
      usuario: empleado.usuario,
      telefono: empleado.telefono,
      cargo: empleado.cargo
    };
    this.mostrarModalEditar = true;
    this.mensaje = '';
  }

  /**
   * Guardar cambios del empleado
   */
  guardarCambios() {
    // Validaciones estrictas antes de enviar
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(this.empleadoEditar.nombre_completo);
    const telefonoValido = /^[0-9]+$/.test(this.empleadoEditar.telefono);

    if (!this.empleadoEditar.nombre_completo || !this.empleadoEditar.usuario ||
        !this.empleadoEditar.telefono || !this.empleadoEditar.cargo) {
      this.mensaje = '❌ Todos los campos son requeridos';
      return;
    }
    if (!nombreValido) {
      this.mensaje = '❌ El nombre solo puede contener letras y espacios';
      return;
    }
    if (!telefonoValido) {
      this.mensaje = '❌ El teléfono solo puede contener números';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    const datosActualizacion = {
      nombre_completo: this.empleadoEditar.nombre_completo,
      usuario: this.empleadoEditar.usuario,
      telefono: this.empleadoEditar.telefono,
      cargo: this.empleadoEditar.cargo
    };

    this.apiService.actualizarEmpleado(this.empleadoEditar.id_empleado, datosActualizacion).subscribe({
      next: (response) => {
        if (response.success) {
          this.mensaje = '✅ Empleado actualizado exitosamente';
          this.mostrarModalEditar = false;
          this.cargarEmpleados();
          setTimeout(() => this.mensaje = '', 3000);
        } else {
          this.mensaje = '❌ Error al actualizar: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al actualizar empleado:', error);
        this.mensaje = '❌ Error al actualizar empleado';
        this.cargando = false;
      }
    });
  }

  /**
   * Cancelar edición
   */
  cancelarEdicion() {
    this.mostrarModalEditar = false;
    this.empleadoEditar = {
      id_empleado: '',
      nombre_completo: '',
      usuario: '',
      telefono: '',
      cargo: 'Cajero'
    };
    this.mensaje = '';
  }

  /**
   * Mostrar confirmación de eliminación
   */
  eliminarEmpleado(empleado: Empleado) {
    this.empleadoAEliminar = empleado;
    this.mostrarConfirmacion = true;
    this.mensaje = '';
  }

  /**
   * Confirmar eliminación
   */
  confirmarEliminacion() {
    if (!this.empleadoAEliminar) return;

    this.cargando = true;
    this.mensaje = '';

    this.apiService.eliminarEmpleado(this.empleadoAEliminar.id_empleado).subscribe({
      next: (response) => {
        if (response.success) {
          this.mensaje = '✅ Empleado eliminado permanentemente';

          // Eliminar de la lista local inmediatamente
          this.empleados = this.empleados.filter(emp => emp.id_empleado !== this.empleadoAEliminar!.id_empleado);
          this.empleadosFiltrados = this.empleadosFiltrados.filter(emp => emp.id_empleado !== this.empleadoAEliminar!.id_empleado);

          // Cerrar modal y limpiar
          this.mostrarConfirmacion = false;
          this.empleadoAEliminar = null;

          // Recargar la lista para asegurar sincronización
          this.cargarEmpleados();

          setTimeout(() => this.mensaje = '', 3000);
        } else {
          this.mensaje = '❌ Error al eliminar: ' + response.message;
        }
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al eliminar empleado:', error);
        this.mensaje = '❌ Error al eliminar empleado';
        this.cargando = false;
      }
    });
  }

  /**
   * Cancelar eliminación
   */
  cancelarEliminacion() {
    this.mostrarConfirmacion = false;
    this.empleadoAEliminar = null;
    this.mensaje = '';
  }

  /**
   * Agregar nuevo empleado
   */
  agregarEmpleadoClick() {
    this.agregarEmpleado.emit();
  }

  /**
   * Volver al panel anterior
   */
  volver() {
    this.volverEvent.emit();
  }
}