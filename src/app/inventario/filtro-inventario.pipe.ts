import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'filtroInventario', standalone: true })
export class FiltroInventarioPipe implements PipeTransform {
  transform(productos: any[], filtro: string): any[] {
    if (!filtro) return productos;
    filtro = filtro.toLowerCase();
    return productos.filter(p =>
      p.codigo.toLowerCase().includes(filtro) ||
      p.nombre.toLowerCase().includes(filtro)
    );
  }
}