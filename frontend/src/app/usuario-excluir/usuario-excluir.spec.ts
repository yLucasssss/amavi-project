import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioExcluir } from './usuario-excluir';

describe('UsuarioExcluir', () => {
  let component: UsuarioExcluir;
  let fixture: ComponentFixture<UsuarioExcluir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuarioExcluir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuarioExcluir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
