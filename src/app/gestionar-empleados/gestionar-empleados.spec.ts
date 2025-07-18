import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarEmpleados } from './gestionar-empleados';

describe('GestionarEmpleados', () => {
  let component: GestionarEmpleados;
  let fixture: ComponentFixture<GestionarEmpleados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarEmpleados]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarEmpleados);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
