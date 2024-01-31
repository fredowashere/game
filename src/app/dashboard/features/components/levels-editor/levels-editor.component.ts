import { Component, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { MaterialService } from '../../services/materials.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AreYouSureComponent } from '../../are-you-sure.component';
import { LevelService } from '../../services/levels.service';
import { ILevel } from '../../models/levels';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-levels-editor',
  templateUrl: './levels-editor.component.html',
  styleUrls: ['./levels-editor.component.css']
})
export class LevelsEditorComponent {

  @ViewChild("dt") dt!: TableComponent;

  constructor(
    public levelService: LevelService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  async reset() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.levelService.resetToFactory();
  }

  async create() {
    this.router.navigate([ -1 ], { relativeTo: this.route });
  }

  async edit(level: ILevel) {
    this.router.navigate([ level.id ], { relativeTo: this.route });
  }

  async deleteOne(level: ILevel) {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.levelService.delete(level.id!);
  }

  async deleteMany() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    for (const level of this.dt.selectedRows) {
      this.levelService.delete(level);
    }
  }
}