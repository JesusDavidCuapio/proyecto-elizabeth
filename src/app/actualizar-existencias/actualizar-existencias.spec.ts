import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarExistencias } from './actualizar-existencias';

describe('ActualizarExistencias', () => {
  let component: ActualizarExistencias;
  let fixture: ComponentFixture<ActualizarExistencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualizarExistencias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarExistencias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
