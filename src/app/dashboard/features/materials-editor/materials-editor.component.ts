import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialEditComponent } from './material-edit-dialog.component';
import { AreYouSureComponent } from '../are-you-sure.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { IMaterial } from '../models/materials';

@Component({
  selector: 'app-materials-editor',
  templateUrl: './materials-editor.component.html',
  styleUrls: ['./materials-editor.component.css']
})
export class MaterialsEditorComponent {

  @ViewChild("dt") dt!: TableComponent;

  materials: IMaterial[] = [];

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    const materials = localStorage.getItem("materials");
    if (materials) {
      this.materials = JSON.parse(materials);
    }
  }

  async create() {
    const modalRef = this.modalService.open(MaterialEditComponent);
    await modalRef.result;
  }

  async edit(material: IMaterial) {
    const modalRef = this.modalService.open(MaterialEditComponent);
    modalRef.componentInstance.material = material;
    await modalRef.result;
  }

  async deleteOne(material: IMaterial) {
    const modalRef = this.modalService.open(AreYouSureComponent);
    const result = await modalRef.result;
    console.log("Deleting single?", result, material);
  }

  async deleteMany() {
    const modalRef = this.modalService.open(AreYouSureComponent);
    const result = await modalRef.result;
    console.log("Deleting multiple?", result, this.dt.selectedRows);
  }
}
