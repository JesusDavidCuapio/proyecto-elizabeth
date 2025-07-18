import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Almacenista } from './almacenista';

describe('Almacenista', () => {
  let component: Almacenista;
  let fixture: ComponentFixture<Almacenista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Almacenista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Almacenista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
