import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-trabajador',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login-trabajador.html',
  styleUrls: ['./login-trabajador.css']
})
export class LoginTrabajador {
  usuario: string = '';
  contrasena: string = '';
  mensaje: string = '';
  cargando: boolean = false;

  @Output() volverEvent = new EventEmitter<void>();
  @Output() loginEvent = new EventEmitter<string>();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  ingresar() {
    // Validar que los campos no estén vacíos
    if (!this.usuario || !this.contrasena) {
      this.mensaje = '❌ Por favor complete todos los campos';
      return;
    }

    this.cargando = true;
    this.mensaje = '';

    // Crear objeto con credenciales
    const credenciales = {
      usuario: this.usuario,
      contrasena: this.contrasena
    };

    console.log('Intentando login con:', { usuario: this.usuario });

    // Llamar al servicio de login
    this.apiService.login(credenciales).subscribe({
      next: (response) => {
        console.log('Respuesta del login:', response);

        if (response.success) {
          this.mensaje = '✅ Login exitoso. Redirigiendo...';

          // Guardar datos del empleado en AuthService
          this.authService.setEmpleadoData({
            id: response.data.empleado.id,
            nombre: response.data.empleado.nombre,
            usuario: response.data.empleado.usuario,
            cargo: response.data.empleado.cargo
          });

          // Guardar el id_empleado en localStorage para el resto de la app
          localStorage.setItem('id_empleado', response.data.empleado.id);

          // Emitir el cargo del empleado para redireccionar
          setTimeout(() => {
            this.loginEvent.emit(response.data.cargo);
          }, 1000);
        } else {
          this.mensaje = '❌ ' + response.message;
        }

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error en login:', error);
        this.mensaje = '❌ ' + (error.error?.message || 'Error de conexión');
        this.cargando = false;
      }
    });
  }

  volver() {
    this.volverEvent.emit();
  }
}