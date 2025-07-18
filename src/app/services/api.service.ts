import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';
  
  constructor(private http: HttpClient) {}

  enviarReporte() {
  console.log('¡Botón Enviar reporte presionado!');
  // ...el resto de tu código...
}

  reportarProducto(datos: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/reportes-productos`, datos);
}

  // Empleados
  crearEmpleado(empleado: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/empleados`, empleado);
  }

  // Login con verificación completa
  login(credenciales: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/empleados/login`, credenciales);
  }

  // Método de prueba
  testConexion(): Observable<any> {
    return this.http.get(`${this.baseUrl}/test`);
  }

  // Inventario
  getInventario(): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventario`);
  }

  buscarProductos(termino: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventario/buscar?busqueda=${termino}`);
  }

  obtenerProductoPorCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/inventario/${codigo}`);
  }

  // Ventas
  registrarVenta(ventaData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/ventas`, ventaData);
  }

  obtenerVentas(): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas`);
  }

  obtenerVentaPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/ventas/${id}`);
  }

  // Buscar el final de la clase ApiService y agregar antes de la llave de cierre:

  // MÉTODOS PARA GESTIONAR EMPLEADOS
  
  // Obtener todos los empleados
  obtenerEmpleados(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/empleados`);
  }

  // Obtener empleado por ID
  obtenerEmpleadoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/empleados/${id}`);
  }

  // Actualizar empleado
  actualizarEmpleado(id: string, empleado: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/empleados/${id}`, empleado);
  }

  // Eliminar empleado
  eliminarEmpleado(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/empleados/${id}`);
  }

  // Buscar empleados
  buscarEmpleados(termino: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/empleados/buscar?termino=${termino}`);
  }

  // Filtrar empleados por cargo
  filtrarEmpleadosPorCargo(cargo: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/empleados/cargo/${cargo}`);
  }

  /**
   * Verificar si un producto existe por código
   */
  verificarProducto(codigo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recepcion/verificar/${codigo}`);
  }

  /**
   * Recibir producto existente (aumentar stock)
   */
  recibirProductoExistente(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recepcion/producto-existente`, datos);
  }

  /**
   * Crear producto nuevo
   */
  crearProductoNuevo(datos: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/recepcion/producto-nuevo`, datos);
  }

  /**
   * Obtener historial de recepciones
   */
  obtenerHistorialRecepciones(limite: number = 50): Observable<any> {
    return this.http.get(`${this.baseUrl}/recepcion/historial?limite=${limite}`);
  }

    /**
   * Buscar productos para autocompletado
   */
  buscarProductosAutocompletado(termino: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recepcion/buscar-productos?termino=${termino}`);
  }

   // ========================================
  // MÉTODOS PARA ACTUALIZACIÓN DE EXISTENCIAS
  // ========================================

  /**
   * Obtener todos los productos para actualización
   */
  obtenerProductosParaActualizar(): Observable<any> {
    return this.http.get(`${this.baseUrl}/actualizacion/productos`);
  }

  /**
   * Buscar productos por término
   */
  buscarProductosParaActualizar(termino: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/actualizacion/productos/buscar?termino=${termino}`);
  }

  /**
   * Obtener producto por ID
   */
  obtenerProductoPorId(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/actualizacion/productos/${id}`);
  }

  /**
   * Actualizar existencias de un producto
   */
  actualizarExistencias(datos: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/actualizacion/actualizar`, datos);
  }

  obtenerProductosMasVendidos(): Observable<any> {
  return this.http.get(`${this.baseUrl}/reporte-ventas/productos-mas-vendidos-general`);
}


  /**
   * Obtener historial de ajustes
   */
  obtenerHistorialAjustes(limite: number = 50): Observable<any> {
    return this.http.get(`${this.baseUrl}/actualizacion/historial?limite=${limite}`);
  }
  ventasPorDia(fechaInicio: string, fechaFin: string) {
  return this.http.get(`${this.baseUrl}/reporte-ventas/ventas-por-dia`, { params: { fechaInicio, fechaFin } });
}

productosMasVendidos(fechaInicio: string, fechaFin: string) {
  return this.http.get(`${this.baseUrl}/reporte-ventas/productos-mas-vendidos`, { params: { fechaInicio, fechaFin } });
}



rendimientoPorEmpleado(fechaInicio: string, fechaFin: string) {
  return this.http.get(`${this.baseUrl}/reporte-ventas/rendimiento-empleado`, { params: { fechaInicio, fechaFin } });
}

ingresosPorDia(fechaInicio: string, fechaFin: string) {
  return this.http.get(`${this.baseUrl}/reporte-ventas/ingresos-por-dia`, { params: { fechaInicio, fechaFin } });
}

obtenerVentasRegistradas(): Observable<any> {
  return this.http.get(`${this.baseUrl}/ventas`);
}

obtenerTodosLosProductos(): Observable<any> {
  return this.http.get(`${this.baseUrl}/actualizacion/productos`);
}

obtenerReportesProductos(): Observable<any> {
  return this.http.get(`${this.baseUrl}/reportes-productos`);
}
  /**
 * Verificar código y obtener sugerencia
   */
  verificarCodigo(codigo: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recepcion/verificar-codigo?codigo=${codigo}`);
  }

}
