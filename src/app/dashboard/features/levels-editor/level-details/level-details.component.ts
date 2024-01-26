import { Component } from '@angular/core';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.css']
})
export class LevelDetailsComponent {

  ngOnInit() {

    const map = new window.MapDataEditor(
      document.querySelector("#map-data-editor"),
      [
        { id: 1, name: "Wall", color: 'rgba(136,136,136,1)', solid: false },
        { id: 0, name: "Empty Space", color: 'rgba(51,51,51,1)', solid: false }
      ],
      1024,
      576
    );
    map.setLMB(1);
    map.setRMB(0);
    map.import();

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
