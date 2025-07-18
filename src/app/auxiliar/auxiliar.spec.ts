import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auxiliar } from './auxiliar';

describe('Auxiliar', () => {
  let component: Auxiliar;
  let fixture: ComponentFixture<Auxiliar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auxiliar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Auxiliar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
