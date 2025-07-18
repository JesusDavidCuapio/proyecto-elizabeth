import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-crear-trabajador',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-trabajador.html',
  styleUrls: ['./crear-trabajador.css']
})
export class CrearTrabajador {
  @Output() volverEvent = new EventEmitter<void>();

  empleado = {
    id_empleado: '',
    nombre_completo: '',
    usuario: '',
    contrasena: '',
    telefono: '',
    cargo: ''
  };

  mensaje = '';
  cargando = false;

  constructor(private apiService: ApiService) {}

  onSubmit(form: any) {
    // Validaciones estrictas antes de enviar
    const idValido = /^EMP[0-9]{3}$/.test(this.empleado.id_empleado);
    const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(this.empleado.nombre_completo);
    const telefonoValido = /^[0-9]+$/.test(this.empleado.telefono);

    if (!idValido) {
      this.mensaje = '❌ El ID debe tener el formato EMP### (Ej: EMP001)';
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

    if (form.valid) {
      this.cargando = true;
      this.mensaje = '';

      console.log('Datos a enviar:', this.empleado);

      this.apiService.crearEmpleado(this.empleado).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response);
          this.mensaje = '✅ Empleado creado exitosamente';
          this.limpiarFormulario();
          form.resetForm();
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error:', error);
          this.mensaje = '❌ Error: ' + (error.error?.message || 'Error desconocido');
          this.cargando = false;
        }
      });
    }
  }

  limpiarFormulario() {
    this.empleado = {
      id_empleado: '',
      nombre_completo: '',
      usuario: '',
      contrasena: '',
      telefono: '',
      cargo: ''
    };
  }

  volver() {
    this.volverEvent.emit();
  }
}