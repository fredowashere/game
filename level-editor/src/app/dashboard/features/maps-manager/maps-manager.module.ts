import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MapsManagerComponent } from './maps-manager.component';


const routes: Routes = [
  { path: '', component: MapsManagerComponent }
];

@NgModule({
  declarations: [
    MapsManagerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class MapsManagerModule { }
