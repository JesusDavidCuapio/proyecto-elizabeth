import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerReportes } from './ver-reportes';

describe('VerReportes', () => {
  let component: VerReportes;
  let fixture: ComponentFixture<VerReportes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerReportes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerReportes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
