import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private empleadoData: any = null;

  constructor() {}

  // Método para obtener datos del empleado
  getEmpleadoData() {
    if (this.empleadoData) {
      return this.empleadoData;
    }
    
    // Intentar obtener desde localStorage
    const storedData = localStorage.getItem('empleadoData');
    if (storedData) {
      this.empleadoData = JSON.parse(storedData);
      return this.empleadoData;
    }
    
    return null;
  }

  // Método para establecer datos del empleado al hacer login
  setEmpleadoData(data: any) {
    this.empleadoData = data;
    localStorage.setItem('empleadoData', JSON.stringify(data));
    console.log('Datos del empleado guardados:', data);
  }

  // Método para limpiar datos al cerrar sesión
  clearEmpleadoData() {
    this.empleadoData = null;
    localStorage.removeItem('empleadoData');
    console.log('Datos del empleado eliminados');
  }

  // Verificar si hay empleado autenticado
  isAuthenticated(): boolean {
    return this.getEmpleadoData() !== null;
  }

  // Obtener solo el ID del empleado
  getEmpleadoId(): string | null {
    const data = this.getEmpleadoData();
    return data ? data.id : null;
  }

  // Obtener el cargo del empleado
  getEmpleadoCargo(): string | null {
    const data = this.getEmpleadoData();
    return data ? data.cargo : null;
  }
}