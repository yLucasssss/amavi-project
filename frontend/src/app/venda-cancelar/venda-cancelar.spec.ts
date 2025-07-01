import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendaCancelar } from './venda-cancelar';

describe('VendaCancelar', () => {
  let component: VendaCancelar;
  let fixture: ComponentFixture<VendaCancelar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendaCancelar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendaCancelar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
