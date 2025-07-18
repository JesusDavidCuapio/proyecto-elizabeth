import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTrabajador } from './crear-trabajador';

describe('CrearTrabajador', () => {
  let component: CrearTrabajador;
  let fixture: ComponentFixture<CrearTrabajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearTrabajador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
