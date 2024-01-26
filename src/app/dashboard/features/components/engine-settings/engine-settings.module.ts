import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EngineSettingsComponent } from './engine-settings.component';

const routes: Routes = [
  { path: '', component: EngineSettingsComponent }
];

@NgModule({
  declarations: [
    EngineSettingsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class EngineSettingsModule { }