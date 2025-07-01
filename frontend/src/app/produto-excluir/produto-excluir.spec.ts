import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoExcluir } from './produto-excluir';

describe('ProdutoExcluir', () => {
  let component: ProdutoExcluir;
  let fixture: ComponentFixture<ProdutoExcluir>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProdutoExcluir]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutoExcluir);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
