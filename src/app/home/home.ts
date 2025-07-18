import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { CrearTrabajador } from '../crear-trabajador/crear-trabajador';
import { LoginTrabajador } from '../login-trabajador/login-trabajador';
import { Cajero } from '../cajero/cajero';
import { Inventario } from '../inventario/inventario';
import { RegistrarVenta } from '../registrar-venta/registrar-venta';
import { Auxiliar } from '../auxiliar/auxiliar';
import { RecibirProductos } from '../recibir-productos/recibir-productos';
import { Almacenista } from '../almacenista/almacenista';
import { ActualizarExistencias } from '../actualizar-existencias/actualizar-existencias';
import { ReportarProducto } from '../reportar-producto/reportar-producto';
import { Administrador } from '../administrador/administrador';
import { GestionarEmpleados } from '../gestionar-empleados/gestionar-empleados';
import { VerReportes } from '../ver-reportes/ver-reportes';
import { VerVentas } from '../ver-ventas/ver-ventas';
import { VerReportesProductos } from '../ver-reportes-productos/ver-reportes-productos';
import { AdministrarInventario } from '../administrar-inventario/administrar-inventario';
import { VerHistorialRecepciones } from '../ver-historial-recepciones/ver-historial-recepciones';
import { VerHistorialAjustes } from '../ver-historial-ajustes/ver-historial-ajustes';

@Component({
  selector: 'app-home',
  standalone: true,
   imports: [
    NgIf, CrearTrabajador, LoginTrabajador, Cajero, Inventario, RegistrarVenta, Auxiliar, RecibirProductos, Almacenista, ActualizarExistencias, ReportarProducto, Administrador, GestionarEmpleados, VerReportes, VerVentas, VerReportesProductos, AdministrarInventario, VerHistorialRecepciones, VerHistorialAjustes
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  mostrarCrearTrabajador = false;
  mostrarLoginTrabajador = false;
  mostrarCajero = false;
  mostrarInventario = false;
  mostrarRegistrarVenta = false;
  origenInventario: string | null = null;
  mostrarAuxiliar = false;
  mostrarRecibirProductos = false;
  mostrarAlmacenista = false;
  mostrarActualizarExistencias = false;
  mostrarReportarProducto = false;
  mostrarAdministrador = false;
  mostrarGestionarEmpleados = false;
  origenCrearTrabajador: string | null = null;
  mostrarVerReportes = false;
  mostrarVerVentas = false;
  mostrarVerReportesProductos = false;
  mostrarAdministrarInventario = false;
  origenRecibirProductos: string | null = null;
  origenActualizarExistencias: string | null = null;
  origenReportarProducto: string | null = null;
  mostrarVerHistorialRecepciones = false;
  mostrarVerHistorialAjustes = false;

  mostrarCrear() {
    this.mostrarCrearTrabajador = true;
    this.mostrarLoginTrabajador = false;
    this.mostrarCajero = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
  }

  mostrarLogin() {
    this.mostrarLoginTrabajador = true;
    this.mostrarCrearTrabajador = false;
    this.mostrarCajero = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
  }

  mostrarPanelCajero() {
    this.mostrarCajero = true;
    this.mostrarCrearTrabajador = false;
    this.mostrarLoginTrabajador = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
  }

  mostrarPanelInventario(origen: string | null = null) {
    this.mostrarInventario = true;
    this.mostrarCajero = false;
    this.mostrarCrearTrabajador = false;
    this.mostrarLoginTrabajador = false;
    this.mostrarRegistrarVenta = false;
    this.mostrarAuxiliar = false;
    this.mostrarAlmacenista = false;
    this.mostrarAdministrarInventario = false;
    this.origenInventario = origen;
  }

  mostrarPanelHistorialRecepciones() {
    this.mostrarRecibirProductos = false;
    this.mostrarVerHistorialRecepciones = true;
  }

  mostrarPanelRegistrarVenta() {
    this.mostrarRegistrarVenta = true;
    this.mostrarCajero = false;
    this.mostrarCrearTrabajador = false;
    this.mostrarLoginTrabajador = false;
    this.mostrarInventario = false;
  }

  mostrarPanelAlmacenista() {
    this.mostrarAlmacenista = true;
    this.mostrarCajero = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
    this.mostrarAuxiliar = false;
    this.mostrarRecibirProductos = false;
  }

  mostrarPanelRecibirProductos(origen: string | null = null) {
    this.mostrarRecibirProductos = true;
    this.mostrarAuxiliar = false;
    this.mostrarCajero = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
    this.mostrarCrearTrabajador = false;
    this.mostrarLoginTrabajador = false;
    this.mostrarAdministrarInventario = false;
    this.origenRecibirProductos = origen;
  }

  mostrarPanelActualizarExistencias(origen: string | null = null) {
    this.mostrarActualizarExistencias = true;
    this.mostrarAlmacenista = false;
    this.mostrarAdministrarInventario = false;
    this.origenActualizarExistencias = origen;
  }

  mostrarPanelReportarProducto(origen: string | null = null) {
    this.mostrarReportarProducto = true;
    this.mostrarAlmacenista = false;
    this.mostrarAdministrarInventario = false;
    this.origenReportarProducto = origen;
  }

  mostrarPanelAdministrador() {
    this.mostrarAdministrador = true;
  }

  mostrarPanelGestionarEmpleados() {
    this.mostrarGestionarEmpleados = true;
    this.mostrarAdministrador = false;
  }

  mostrarPanelCrearTrabajadorDesdeGestionar() {
    this.mostrarCrearTrabajador = true;
    this.mostrarGestionarEmpleados = false;
    this.origenCrearTrabajador = 'gestionar-empleados';
  }

  mostrarPanelVerReportes() {
    this.mostrarVerReportes = true;
    this.mostrarAdministrador = false;
  }

  mostrarPanelVerVentas() {
    this.mostrarVerVentas = true;
    this.mostrarVerReportes = false;
  }

  mostrarPanelVerReportesProductos() {
    this.mostrarVerReportesProductos = true;
    this.mostrarVerReportes = false;
  }

  mostrarPanelAdministrarInventario() {
    this.mostrarAdministrarInventario = true;
    this.mostrarAdministrador = false;
  }

  mostrarPanelHistorialAjustes() {
    this.mostrarActualizarExistencias = false;
    this.mostrarVerHistorialAjustes = true;
  }

  onLogin(cargo: string) {
    console.log('Redirigiendo a cargo:', cargo);
    
    // Ocultar todas las pantallas
    this.mostrarCrearTrabajador = false;
    this.mostrarLoginTrabajador = false;
    this.mostrarCajero = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
    this.mostrarAuxiliar = false;
    this.mostrarAlmacenista = false;
    this.mostrarAdministrador = false;
    this.mostrarGestionarEmpleados = false;
    this.mostrarVerReportes = false;
    this.mostrarVerVentas = false;
    this.mostrarVerReportesProductos = false;
    this.mostrarAdministrarInventario = false;
    this.mostrarActualizarExistencias = false;
    this.mostrarRecibirProductos = false;
    this.mostrarReportarProducto = false;
    this.mostrarVerHistorialRecepciones = false;

    // Redireccionar según el cargo desde la base de datos
    switch(cargo.toLowerCase()) {
      case 'cajero':
        this.mostrarCajero = true;
        break;
      case 'auxiliar':
        this.mostrarAuxiliar = true;
        break;
      case 'almacenista':
        this.mostrarAlmacenista = true;
        break;
      case 'administrador':
        this.mostrarAdministrador = true;
        break;
      default:
        console.error('Cargo no reconocido:', cargo);
        alert('Error: Cargo no reconocido');
    }
  }

  volver() {
    // Si vienes de Ver Historial Recepciones, vuelve a Recibir Productos
    if (this.mostrarVerHistorialRecepciones) {
      this.mostrarVerHistorialRecepciones = false;
      this.mostrarRecibirProductos = true;
      return;
    }
    
    // Si vienes de Inventario y el origen es Cajero, vuelve al Cajero
    if (this.mostrarInventario && this.origenInventario === 'cajero') {
      this.mostrarInventario = false;
      this.mostrarCajero = true;
      this.origenInventario = null;
      return;
    }
    // Si vienes de Inventario y el origen es Auxiliar, vuelve al Auxiliar
    if (this.mostrarInventario && this.origenInventario === 'auxiliar') {
      this.mostrarInventario = false;
      this.mostrarAuxiliar = true;
      this.origenInventario = null;
      return;
    }
    // Si vienes de Inventario y el origen es Almacenista, vuelve al Almacenista
    if (this.mostrarInventario && this.origenInventario === 'almacenista') {
      this.mostrarInventario = false;
      this.mostrarAlmacenista = true;
      this.origenInventario = null;
      return;
    }
    // Si vienes de Inventario y el origen es Administrador, vuelve a Administrar Inventario
    if (this.mostrarInventario && this.origenInventario === 'admin') {
      this.mostrarInventario = false;
      this.mostrarAdministrarInventario = true;
      this.origenInventario = null;
      return;
    }
    // Si vienes de Recibir Productos y el origen es Administrador, vuelve a Administrar Inventario
    if (this.mostrarRecibirProductos && this.origenRecibirProductos === 'admin') {
      this.mostrarRecibirProductos = false;
      this.mostrarAdministrarInventario = true;
      this.origenRecibirProductos = null;
      return;
    }
    // Si vienes de Actualizar Existencias y el origen es Administrador, vuelve a Administrar Inventario
    if (this.mostrarActualizarExistencias && this.origenActualizarExistencias === 'admin') {
      this.mostrarActualizarExistencias = false;
      this.mostrarAdministrarInventario = true;
      this.origenActualizarExistencias = null;
      return;
    }
    // Si vienes de Reportar Producto y el origen es Administrador, vuelve a Administrar Inventario
    if (this.mostrarReportarProducto && this.origenReportarProducto === 'admin') {
      this.mostrarReportarProducto = false;
      this.mostrarAdministrarInventario = true;
      this.origenReportarProducto = null;
      return;
    }
    // Si vienes de Registrar Venta, vuelve al Cajero
    if (this.mostrarRegistrarVenta) {
      this.mostrarRegistrarVenta = false;
      this.mostrarCajero = true;
      return;
    }
    // Si vienes de Recibir Productos, vuelve al Auxiliar
    if (this.mostrarRecibirProductos) {
      this.mostrarRecibirProductos = false;
      this.mostrarAuxiliar = true;
      return;
    }
    // Si vienes del panel de Almacenista, cierra sesión y vuelve al menú principal
    if (this.mostrarAlmacenista) {
      this.mostrarAlmacenista = false;
      return;
    }
    // Si vienes del panel de Actualizar Existencias, vuelve al panel de Almacenista
    if (this.mostrarActualizarExistencias) {
      this.mostrarActualizarExistencias = false;
      this.mostrarAlmacenista = true;
      return;
    }
    // Si vienes del panel de reportar Producto, vuelve al panel de Almacenista
    if (this.mostrarReportarProducto) {
      this.mostrarReportarProducto = false;
      this.mostrarAlmacenista = true;
      return;
    }
    // Si vienes del panel de Administrador, cierra sesión y vuelve al menú principal
    if (this.mostrarAdministrador) {
      this.mostrarAdministrador = false;
      return;
    }
    if (this.mostrarGestionarEmpleados) {
      this.mostrarGestionarEmpleados = false;
      this.mostrarAdministrador = true;
      return;
    }
    if (this.mostrarCrearTrabajador && this.origenCrearTrabajador === 'gestionar-empleados') {
      this.mostrarCrearTrabajador = false;
      this.mostrarGestionarEmpleados = true;
      this.origenCrearTrabajador = null;
      return;
    }
    if (this.mostrarVerReportes) {
      this.mostrarVerReportes = false;
      this.mostrarAdministrador = true;
      return;
    }
    if (this.mostrarVerVentas) {
      this.mostrarVerVentas = false;
      this.mostrarVerReportes = true;
      return;
    }
    if (this.mostrarVerReportesProductos) {
      this.mostrarVerReportesProductos = false;
      this.mostrarVerReportes = true;
      return;
    }
    if (this.mostrarAdministrarInventario) {
      this.mostrarAdministrarInventario = false;
      this.mostrarAdministrador = true;
      return;
    }
    if (this.mostrarCrearTrabajador) {
      this.mostrarCrearTrabajador = false;
      return;
    }
     if (this.mostrarVerHistorialAjustes) {
      this.mostrarVerHistorialAjustes = false;
      this.mostrarActualizarExistencias = true;
      return;
    }
    
    // Si vienes del panel de Actualizar Existencias, vuelve al panel de Almacenista
    if (this.mostrarActualizarExistencias) {
      this.mostrarActualizarExistencias = false;
      this.mostrarAlmacenista = true;
      return;
    }
    
    // Si vienes del panel de reportar Producto, vuelve al panel de Almacenista
    if (this.mostrarReportarProducto) {
      this.mostrarReportarProducto = false;
      this.mostrarAlmacenista = true;
      return;
    }
    // Por defecto, vuelve al menú principal
    this.mostrarCrearTrabajador = false;
    this.mostrarLoginTrabajador = false;
    this.mostrarCajero = false;
    this.mostrarInventario = false;
    this.mostrarRegistrarVenta = false;
    this.mostrarAuxiliar = false;
    this.origenInventario = null;
    this.mostrarRecibirProductos = false;
    this.mostrarVerHistorialRecepciones = false;
  }
}