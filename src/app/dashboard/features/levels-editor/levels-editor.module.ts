import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LevelsEditorComponent } from './levels-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MapMaterialsComponent } from './materials/map-materials/map-materials.component';
import { GlobalMaterialsComponent } from './materials/global-materials/global-materials.component';
import { MapEditorComponent } from './map-editor/map-editor.component';

const routes: Routes = [
  { path: '', component: LevelsEditorComponent }
];

@NgModule({
  declarations: [
    LevelsEditorComponent,
    MapMaterialsComponent,
    GlobalMaterialsComponent,
    MapEditorComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class LevelsEditorModule { }