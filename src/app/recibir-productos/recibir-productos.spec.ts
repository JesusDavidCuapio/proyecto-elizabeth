import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibirProductos } from './recibir-productos';

describe('RecibirProductos', () => {
  let component: RecibirProductos;
  let fixture: ComponentFixture<RecibirProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecibirProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecibirProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
