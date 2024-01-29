import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { IMaterial } from '../../../models/materials';
import { Subject, takeUntil } from 'rxjs';
import { MaterialService } from '../../../services/materials.service';
import { AreYouSureComponent } from '../../../are-you-sure.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-level-details',
  templateUrl: './level-details.component.html',
  styleUrls: ['./level-details.component.css']
})
export class LevelDetailsComponent {

  levelId = -1;

  destroy$ = new Subject<void>();

  lmbs: IMaterial[] = [];
  rmbs: IMaterial[] = [];
  materialNameFormatter = (m: IMaterial) => m.name;
  map: any = null;

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
      x: new FormControl(0.3),
      y: new FormControl(0.3),
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
    private route: ActivatedRoute
  ) {
    this.levelId = Number(route.snapshot.paramMap.get("levelId"));
    console.log(this.levelId);
  }

  ngOnInit() {

    this.map = new window.MapDataEditor(
      document.querySelector("#map-data-editor"),
      1024,
      576
    );
    this.map.import();

    let materialsInit = false;
    this.materialService.materials$
      .pipe(takeUntil(this.destroy$))
      .subscribe(materials => {

        const copyOfMaterials = [ ...materials ];
        copyOfMaterials.unshift({ id: null, name: "Eraser", color: "#0000" } as any);

        this.map.setMaterials(copyOfMaterials);

        this.lmbs = copyOfMaterials;
        this.rmbs = copyOfMaterials;

        if (!materialsInit) {
          this.form.controls._lmb.setValue(copyOfMaterials[0]);
          this.form.controls._rmb.setValue(copyOfMaterials[0]);
        }
        materialsInit = true;
      });

    this.form.controls._lmb.valueChanges
      .subscribe(value => this.map.setLMB(value ? value.id : null));

    this.form.controls._rmb.valueChanges
      .subscribe(value => this.map.setRMB(value ? value.id : null));

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
  }

  async clean() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.map.clean();
  }
}
