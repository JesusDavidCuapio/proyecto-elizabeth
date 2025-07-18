import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTrabajador } from './login-trabajador';

describe('LoginTrabajador', () => {
  let component: LoginTrabajador;
  let fixture: ComponentFixture<LoginTrabajador>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginTrabajador]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTrabajador);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
