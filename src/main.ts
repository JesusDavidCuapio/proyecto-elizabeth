import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { App } from './app/app';
import { provideRouter } from '@angular/router'; // <-- Agrega esta línea
import { routes } from './app/app.routes'; 

bootstrapApplication(App, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(routes) // <-- Agrega esta línea
  ]
});