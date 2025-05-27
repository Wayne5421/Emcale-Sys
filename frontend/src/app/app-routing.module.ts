import { OrdensComponent } from './pages/ordens/ordens.component';
import { NgModule, ViewChild } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';


export const routes: Routes = [


  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },


  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
      { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent) },
      { path: 'tecnicos', loadComponent: () => import('./pages/tecnicos/tecnicos.component').then(m => m.TecnicosComponent) },
      { path: 'ordens', loadComponent: () => import('./pages/ordens/ordens.component').then(m => m.OrdensComponent) },
      { path: 'view-ordens', loadComponent: () => import('./pages/view-ordens/view-ordens.component').then(m => m.ViewOrdens) }

    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
