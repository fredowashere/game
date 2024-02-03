import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IMaterial } from '../../../models/materials';
import { Subject, startWith, takeUntil } from 'rxjs';
import { MaterialService } from '../../../services/material.service';
import { AreYouSureComponent } from '../../../are-you-sure.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from '../../../services/level.service';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.css']
})
export class LevelDetailsComponent implements OnInit, OnDestroy {

  levelId = -1;

  destroy$ = new Subject<void>();

  materialsInit = false;
  lmbs: IMaterial[] = [];
  rmbs: IMaterial[] = [];
  materialNameFormatter = (m: IMaterial) => m.name;
  map: any = null;
  playing = false;

  form = new FormGroup({
    name: new FormControl("Example Level"),
    tileSize: new FormControl(24),
    gravity: new FormGroup({
      x: new FormControl(0),
      y: new FormControl(0.3),
    }),
    velLimit: new FormGroup({
      x: new FormControl(2),
      y: new FormControl(16),
    }),
    movementSpeed: new FormGroup({
      jump: new FormControl(6),
      left: new FormControl(0.3),
      right: new FormControl(0.3),
    }),
    player: new FormGroup({
      x: new FormControl(35),
      y: new FormControl(10),
      color: new FormControl("#FF9900")
    }),
    _lmb: new FormControl(),
    _rmb: new FormControl()
  });

  constructor(
    private modalService: NgbModal,
    private materialService: MaterialService,
    private levelService: LevelService,
    private route: ActivatedRoute
  ) {
    this.levelId = Number(route.snapshot.paramMap.get("levelId"));
  }

  ngOnInit() {

    this.map = new window.MapDataEditor(
      document.querySelector("#map-data-editor"),
      1024,
      576
    );
    this.map.import();

    this.form.controls._lmb.valueChanges
      .subscribe(value => this.map.setLMB(value ? value.id : null));

    this.form.controls._rmb.valueChanges
      .subscribe(value => this.map.setRMB(value ? value.id : null));

    this.levelService.levelsUpdated
      .pipe(
        startWith(""),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {

        const materials = this.materialService.getSortedArray(
          this.materialService.getAll(this.levelId)
        );

        const copyOfMaterials = Object.values(materials);
        copyOfMaterials.unshift({ id: 1, name: "Air", color: "#888" } as any);

        this.map.setMaterials(copyOfMaterials);

        this.lmbs = copyOfMaterials;
        this.rmbs = copyOfMaterials;

        if (!this.materialsInit) {
          this.form.controls._lmb.setValue(copyOfMaterials[0]);
          this.form.controls._rmb.setValue(copyOfMaterials[0]);
        }

        this.materialsInit = true;
      });

    if (this.levelId > -1) {

      const levels = this.levelService.getAll();
      const level = levels[this.levelId];

      if (level) {
        this.form.patchValue(level);
        this.map.import(level.data);
      }
    }

    // function load() {
    //   const name = prompt("Insert a name.");
    //   if (name) {
    //     const mapData = localStorage.getItem(name);
    //     map.import(mapData);
    //   }
    // }

    // function save() {
    //   const name = prompt("Choose a name.");
    //   if (name) {
    //     const exported = map.export();
    //     localStorage.setItem(name, exported);
    //   }
    // }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.map.destroy();
    window.stopGameEngine();
  }

  async clean() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.map.clean();
  }

  play() {

    const materials = this.levelService.getById(this.levelId).materials;
    const settings = this.form.getRawValue();
    const data = this.map.export();

    const level = { ...settings, materials, data };

    window.initGameEngine(document.querySelector("#game-engine-target"), 576, 360, level);
    window.startGameEngine();

    this.playing = true;
  }

  stop() {
    window.stopGameEngine();
    this.playing = false;
  }
}
