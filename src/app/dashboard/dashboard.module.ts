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
      { path: '', redirectTo: 'materials-editor', pathMatch: 'full' },
      {
        path: 'materials-editor',
        loadChildren: () =>
          import('./features/materials-editor/materials-editor.module').then(m => m.MaterialsEditorModule)
      },
      {
        path: 'levels-editor',
        loadChildren: () =>
          import('./features/levels-editor/levels-editor.module').then(m => m.LevelsEditorModule)
      },
      {
        path: 'playground',
        loadChildren: () =>
          import('./features/playground/playground.module').then(m => m.PlaygroundModule)
      },
      {
        path: 'engine-settings',
        loadChildren: () =>
          import('./features/engine-settings/engine-settings.module').then(m => m.EngineSettingsModule)
      },
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
