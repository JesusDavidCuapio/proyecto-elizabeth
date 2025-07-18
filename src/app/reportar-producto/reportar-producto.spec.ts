import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportarProducto } from './reportar-producto';

describe('ReportarProducto', () => {
  let component: ReportarProducto;
  let fixture: ComponentFixture<ReportarProducto>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportarProducto]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportarProducto);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
