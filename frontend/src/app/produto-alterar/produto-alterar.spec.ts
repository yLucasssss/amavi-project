import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoAlterar } from './produto-alterar';

describe('ProdutoAlterar', () => {
  let component: ProdutoAlterar;
  let fixture: ComponentFixture<ProdutoAlterar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoAlterar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoAlterar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
