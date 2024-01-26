import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IMaterial } from '../../../models/materials';
import { filter } from 'rxjs';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.css']
})
export class LevelDetailsComponent {
  lmbs = [];
  rmbs = [];
  materialNameFormatter = (mat: IMaterial) => mat.name;

  form = new FormGroup({
    lmb: new FormControl(),
    rmb: new FormControl()
  });

  ngOnInit() {

    const materials = JSON.parse(localStorage.getItem("materials") || "[]");
    materials.unshift({ id: null, name: "Eraser", color: "#0000" });
    this.lmbs = materials;
    this.rmbs = materials;

    const map = new window.MapDataEditor(
      document.querySelector("#map-data-editor"),
      materials,
      1024,
      576
    );
    map.import();

    this.form.controls.lmb.valueChanges
      .subscribe(value => map.setLMB(value && value.id || null));

    this.form.controls.rmb.valueChanges
      .subscribe(value => map.setRMB(value && value.id || null));

    this.form.controls.lmb.setValue(materials[0]);
    this.form.controls.rmb.setValue(materials[0]);

    function load() {
      const name = prompt("Insert a name.");
      if (name) {
        const mapData = localStorage.getItem(name);
        map.import(mapData);
      }
    }

    function save() {
      const name = prompt("Choose a name.");
      if (name) {
        const exported = map.export();
        localStorage.setItem(name, exported);
      }
    }
  }
}
