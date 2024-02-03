import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IMaterial } from '../../../models/materials';
import { Subject, startWith, takeUntil } from 'rxjs';
import { MaterialService } from '../../../services/material.service';
import { AreYouSureComponent } from '../../../are-you-sure.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { LevelService } from '../../../services/level.service';
import { DEFAULT_LEVEL } from '../../../models/levels';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.css']
})
export class LevelDetailsComponent implements OnInit, OnDestroy, AfterViewInit {

  levelId = -1;

  destroy$ = new Subject<void>();

  materialsInit = false;
  lmbs: IMaterial[] = [];
  rmbs: IMaterial[] = [];
  materialNameFormatter = (m: IMaterial) => m.id + " " + (m.name || "--");
  map: any = null;
  playing = false;
  playerPickerColor = "rgba(255,153,0,1)";

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
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.levelId = Number(route.snapshot.paramMap.get("levelId"));
  }

  async ngOnInit() {

    this.map = new window.MapDataEditor(
      document.querySelector("#map-data-editor"),
      1024,
      576
    );
    this.map.import();

    // If level already exists, then load it...
    if (this.levelId > -1) {

      const levels = this.levelService.getAll();
      const level = levels[this.levelId];

      if (level) {
        this.form.patchValue(level);
        this.map.import(level.data);
      }
    }
    // ...otherwise create it, and reload component
    else {

      const newLevel = DEFAULT_LEVEL;
      const levelId = this.levelService.create(newLevel);

      await this.router.navigateByUrl("/", { skipLocationChange: true });
      await this.router.navigate([ "dashboard", "levels-editor", levelId ]);
      return;
    }

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

        this.map.setMaterials(materials);

        this.lmbs = materials;
        this.rmbs = materials;

        if (!this.materialsInit) {
          this.form.controls._lmb.setValue(materials[0]);
          this.form.controls._rmb.setValue(materials[1]);
        }

        this.materialsInit = true;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.map.destroy();
    window.stopGameEngine();
  }

  ngAfterViewInit() {
    const pickerParent = document.querySelector("#playerColorPicker");
    new window.Picker({
        parent: pickerParent,
        defaultColor: this.playerPickerColor,
        onChange: (color: any) => {
            const rgba = color.rgbaString;
            this.playerPickerColor = rgba;
            this.form.controls.player.controls.color.setValue(rgba);
        }
    });
  }

  async clean() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.map.clean();
  }

  extractLevel() {
    const level = this.levelService.getById(this.levelId);
    const settings = this.form.getRawValue();
    const data = this.map.export();
    return { ...level, ...settings, data };
  }

  save() {
    const level = this.extractLevel();
    this.levelService.update(level as any, level as any);
  }

  play() {
    window.initGameEngine(document.querySelector("#game-engine-target"), 576, 360, this.extractLevel());
    window.startGameEngine();
    this.playing = true;
  }

  stop() {
    window.stopGameEngine();
    this.playing = false;
  }
}
