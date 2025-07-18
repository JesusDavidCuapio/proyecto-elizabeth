import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerVentas } from './ver-ventas';

describe('VerVentas', () => {
  let component: VerVentas;
  let fixture: ComponentFixture<VerVentas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerVentas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerVentas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
