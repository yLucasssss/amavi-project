import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAlterar } from './usuario-alterar';

describe('UsuarioAlterar', () => {
  let component: UsuarioAlterar;
  let fixture: ComponentFixture<UsuarioAlterar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioAlterar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioAlterar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
