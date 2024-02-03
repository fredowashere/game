import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { LevelMaterialEditComponent } from './level-material-edit-dialog.component';
import { IMaterial } from '../../../models/materials';
import { AreYouSureComponent } from '../../../are-you-sure.component';
import { MaterialService } from '../../../services/material.service';
import { ActivatedRoute } from '@angular/router';
import { LevelService } from '../../../services/level.service';
import { Subject, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-level-materials',
  templateUrl: './level-materials.component.html',
  styleUrls: ['./level-materials.component.css']
})
export class LevelMaterialsComponent implements OnInit, OnDestroy {

  @ViewChild("dt") dt!: TableComponent;

  destroy$ = new Subject<void>();
  levelId = -1;
  materials: IMaterial[] = [];

  constructor(
    private modalService: NgbModal,
    private materialService: MaterialService,
    private levelService: LevelService,
    private route: ActivatedRoute
  ) {
    this.levelId = Number(route.snapshot.paramMap.get("levelId"));
  }

  ngOnInit() {
    this.levelService.levelsUpdated
      .pipe(
        startWith(""),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.materials = this.materialService.getSortedArray(
          this.materialService.getAll(this.levelId)
        );
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  async reset() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.materialService.resetToFactory(this.levelId);
  }

  async create() {
    const modalRef = this.modalService.open(
      LevelMaterialEditComponent,
      { size: "lg" }
    );
    const results = await modalRef.result;
    this.materialService.create(this.levelId, results.new);
  }

  async edit(material: IMaterial) {
    const modalRef = this.modalService.open(
      LevelMaterialEditComponent,
      { size: "lg" }
    );
    modalRef.componentInstance.material = material;
    const results = await modalRef.result;
    if (results.operation === "Delete") {
      return this.deleteOne(results.old);
    }
    this.materialService.update(this.levelId, results.old, results.new);
  }

  async deleteOne(material: IMaterial) {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.materialService.delete(this.levelId, material.id!);
  }

  async deleteMany() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    for (const material of this.dt.selectedRows) {
      this.materialService.delete(this.levelId, material.id);
    }
  }
}
