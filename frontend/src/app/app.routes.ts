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
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component'; // Importe o novo componente
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component'; // Importe o novo componente

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recuperar-senha', component: RecuperarSenhaComponent }, // Adicione a nova rota
  { path: 'redefinir-senha/:token', component: RedefinirSenhaComponent }, // Adicione a nova rota
  { path: 'usuarios/cadastrar', component: UsuarioCadastroComponent }, // Movida para fora da proteção
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
      { path: 'parametrizacao', component: ParametrizacaoComponent } // Adiciona a nova rota
    ]
  },
  { path: '**', redirectTo: 'login' } // Redireciona para o login se a rota não for encontrada
];