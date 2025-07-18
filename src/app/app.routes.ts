import { Routes } from '@angular/router';
import { Home } from './home/home';
import { CrearTrabajador } from './crear-trabajador/crear-trabajador';
import { RecibirProductos } from './recibir-productos/recibir-productos';

// Componente temporal para login
import { Component } from '@angular/core';
@Component({
  standalone: true,
  template: '<h2>Página de Login Trabajador (temporal)</h2>'
})
export class LoginTrabajador {}

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'crear-trabajador', component: CrearTrabajador },
  { path: 'login-trabajador', component: LoginTrabajador },
  { path: 'recibir-productos', component: RecibirProductos },
  { path: '', redirectTo: '/recibir-productos', pathMatch: 'full' } // <-- agrega esta línea
];