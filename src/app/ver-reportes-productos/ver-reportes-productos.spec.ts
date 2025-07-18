import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReportesProductos } from './ver-reportes-productos';

describe('VerReportesProductos', () => {
  let component: VerReportesProductos;
  let fixture: ComponentFixture<VerReportesProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerReportesProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerReportesProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
