import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MaterialsManagerComponent } from './materials-manager.component';


const routes: Routes = [
  { path: '', component: MaterialsManagerComponent }
];

@NgModule({
  declarations: [
    MaterialsManagerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MaterialsManagerModule { }
