import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarInventario } from './administrar-inventario';

describe('AdministrarInventario', () => {
  let component: AdministrarInventario;
  let fixture: ComponentFixture<AdministrarInventario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarInventario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrarInventario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
