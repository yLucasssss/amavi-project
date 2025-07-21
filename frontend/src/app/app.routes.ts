import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout';
import { DashboardComponent } from './dashboard/dashboard';
import { ProdutoCadastroComponent } from './produto-cadastro/produto-cadastro';
import { ProdutoAlterarComponent } from './produto-alterar/produto-alterar';
import { ProdutoExcluirComponent } from './produto-excluir/produto-excluir';
import { VendaCadastroComponent } from './venda-cadastro/venda-cadastro';
import { VendaCancelarComponent } from './venda-cancelar/venda-cancelar';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro';
import { UsuarioAlterarComponent } from './usuario-alterar/usuario-alterar';
import { UsuarioExcluirComponent } from './usuario-excluir/usuario-excluir';
import { ParametrizacaoComponent } from './parametrizacao/parametrizacao.component';
import { LoginComponent } from './login/login';
import { AuthGuard } from './guards/auth-guard';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { RelatorioProdutosComponent } from './relatorio-produtos/relatorio-produtos';
import { RelatorioVendasComponent } from './relatorio-vendas/relatorio-vendas';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent },
  { path: 'redefinir-senha/:token', component: RedefinirSenhaComponent },
  { path: 'usuarios/cadastrar', component: UsuarioCadastroComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'produtos/cadastrar', component: ProdutoCadastroComponent },
      { path: 'produtos/alterar', component: ProdutoAlterarComponent },
      { path: 'produtos/excluir', component: ProdutoExcluirComponent },
      { path: 'vendas/cadastrar', component: VendaCadastroComponent },
      { path: 'vendas/cancelar', component: VendaCancelarComponent },
      { path: 'usuarios/alterar', component: UsuarioAlterarComponent },
      { path: 'usuarios/excluir', component: UsuarioExcluirComponent },
      { path: 'parametrizacao', component: ParametrizacaoComponent },
      { path: 'relatorios/produtos', component: RelatorioProdutosComponent },
      { path: 'relatorios/vendas', component: RelatorioVendasComponent }
    ]
  },
  { path: '**', redirectTo: 'login' }
];