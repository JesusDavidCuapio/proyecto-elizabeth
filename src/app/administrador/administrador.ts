import { Component, Output, EventEmitter } from '@angular/core';
import { GestionarEmpleados } from '../gestionar-empleados/gestionar-empleados';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [GestionarEmpleados],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css']
})
export class Administrador {
  @Output() volverEvent = new EventEmitter<void>();
  @Output() gestionarEmpleados = new EventEmitter<void>(); // <-- AQUÍ
  @Output() verReportes = new EventEmitter<void>();
  @Output() administrarInventario = new EventEmitter<void>();


  mostrarGestionarEmpleados = false;

  onGestionarEmpleados() {
    this.gestionarEmpleados.emit();
  }

  onVerReportes() {
  this.verReportes.emit();
}

  onAdministrarInventario() {
  this.administrarInventario.emit();
}

  volver() {
    if (this.mostrarGestionarEmpleados) {
      this.mostrarGestionarEmpleados = false;
      return;
    }
    this.volverEvent.emit();
  }

  cerrarSesion() {
    this.volverEvent.emit();
  }
}