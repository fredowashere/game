import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DEFAULT_ENGINE_SETTINGS } from '../models/engine-settings';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-engine-settings',
  templateUrl: './engine-settings.component.html',
  styleUrls: ['./engine-settings.component.css']
})
export class EngineSettingsComponent {

  form = new FormGroup({
    alert_errors: new FormControl(),
    log_info: new FormControl(),
    tile_size: new FormControl(),
    limit_viewport: new FormControl(),
    jump_switch: new FormControl(),
    viewport: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
    }),
    camera: new FormGroup({
      x: new FormControl(),
      y: new FormControl(),
    }),
    key: new FormGroup({
      left: new FormControl(),
      right: new FormControl(),
      up: new FormControl(),
    }),
    player: new FormGroup({
      loc: new FormGroup({
        x: new FormControl(),
        y: new FormControl(),
      }),
      vel: new FormGroup({
        x: new FormControl(),
        y: new FormControl(),
      }),
      can_jump: new FormControl()
    }),
  });

  constructor(
    private toaster: ToastService
  ) {}

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const settings = localStorage.getItem("engine_settings");
    if (settings) {
      this.form.patchValue(JSON.parse(settings));
    }
  }

  reset() {
    localStorage.setItem("engine_settings", JSON.stringify(DEFAULT_ENGINE_SETTINGS));
    this.loadFromLocalStorage();
    this.toaster.show("Successfully resetted to factory settings!", { classname: "bg-success text-white" });
  }

  save() {
    localStorage.setItem("engine_settings", JSON.stringify(this.form.getRawValue()));
    this.toaster.show("Successfully saved current settings!", { classname: "bg-success text-white" });
  }
}