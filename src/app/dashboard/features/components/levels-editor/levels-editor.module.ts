import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LevelsEditorComponent } from './levels-editor.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LevelMaterialsComponent } from './level-materials/level-materials.component';
import { LevelDetailsComponent } from './level-details/level-details.component';

const routes: Routes = [
  { path: ':levelId', component: LevelDetailsComponent },
  { path: '', component: LevelsEditorComponent }
];

@NgModule({
  declarations: [
    LevelsEditorComponent,
    LevelMaterialsComponent,
    LevelDetailsComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class LevelsEditorModule { }