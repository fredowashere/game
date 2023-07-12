import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { DashboardNavbarComponent } from './layout/navbar/navbar.component';
import { DashboardSidebarComponent } from './layout/sidebar/sidebar.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      { path: '', redirectTo: 'maps-manager', pathMatch: 'full' },
      {
        path: 'maps-manager',
        loadChildren: () =>
          import('./features/maps-manager/maps-manager.module')
            .then(m => m.MapsManagerModule)
      },
      {
        path: 'materials-manager',
        loadChildren: () =>
          import('./features/materials-manager/materials-manager.module')
            .then(m => m.MaterialsManagerModule)
      }
    ]
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardNavbarComponent,
    DashboardSidebarComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class DashboardModule { }
