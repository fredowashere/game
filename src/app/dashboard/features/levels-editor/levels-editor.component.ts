import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-levels-editor',
  templateUrl: './levels-editor.component.html',
  styleUrls: ['./levels-editor.component.css']
})
export class LevelsEditorComponent {

  form = new FormGroup({
    tile_size: new FormControl(),
    gravity: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
    }),
    vel_limit: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
    }),
    movement_speed: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
    }),
    player: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
      color: new FormControl()
    }),
  });

  submit() {
    console.log("form.getRawValue()", this.form.getRawValue());
  }
}