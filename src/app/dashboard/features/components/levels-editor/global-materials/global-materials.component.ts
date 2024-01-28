import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { MaterialEditComponent } from '../../materials-editor/material-edit-dialog.component';
import { IMaterial } from '../../../models/materials';
import { AreYouSureComponent } from '../../../are-you-sure.component';
import { MaterialService } from '../../../services/materials.service';

@Component({
  selector: 'app-global-materials',
  templateUrl: './global-materials.component.html',
  styleUrls: ['./global-materials.component.css']
})
export class GlobalMaterialsComponent {

  @ViewChild("dt") dt!: TableComponent;

  constructor(
    public materialService: MaterialService,
    private modalService: NgbModal
  ) { }

  async reset() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.materialService.resetToFactory();
  }

  async create() {
    const modalRef = this.modalService.open(
      MaterialEditComponent,
      { size: "lg" }
    );
    const results = await modalRef.result;
    this.materialService.create(results.new);
  }

  async edit(material: IMaterial) {
    const modalRef = this.modalService.open(
      MaterialEditComponent,
      { size: "lg" }
    );
    modalRef.componentInstance.material = material;
    const results = await modalRef.result;
    if (results.operation === "Delete") {
      return this.deleteOne(results.old);
    }
    this.materialService.update(results.old, results.new);
  }

  async deleteOne(material: IMaterial) {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    this.materialService.delete(material);
  }

  async deleteMany() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    for (const material of this.dt.selectedRows) {
      this.materialService.delete(material);
    }
  }
}
