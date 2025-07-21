import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioProdutos } from './relatorio-produtos';

describe('RelatorioProdutos', () => {
  let component: RelatorioProdutos;
  let fixture: ComponentFixture<RelatorioProdutos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioProdutos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RelatorioProdutos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
