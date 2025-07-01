import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaCadastro } from './venda-cadastro';

describe('VendaCadastro', () => {
  let component: VendaCadastro;
  let fixture: ComponentFixture<VendaCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaCadastro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaCadastro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
