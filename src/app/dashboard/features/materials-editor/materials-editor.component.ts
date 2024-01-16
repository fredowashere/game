import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MaterialEditComponent } from './material-edit-dialog.component';
import { AreYouSureComponent } from '../are-you-sure.component';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { DEFAULT_MATERIALS, IMaterial } from '../models/materials';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-materials-editor',
  templateUrl: './materials-editor.component.html',
  styleUrls: ['./materials-editor.component.css']
})
export class MaterialsEditorComponent {

  @ViewChild("dt") dt!: TableComponent;

  materials: IMaterial[] = [];

  constructor(
    private modalService: NgbModal,
    private toaster: ToastService
  ) { }

  ngOnInit() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    const materials = localStorage.getItem("materials");
    if (materials) {
      this.materials = JSON.parse(materials);
    }
  }

  async reset() {

    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;

    localStorage.setItem("materials", JSON.stringify(DEFAULT_MATERIALS));
    this.loadFromLocalStorage();
    this.toaster.show("Successfully resetted to factory settings!", { classname: "bg-success text-white" });
  }

  async create() {
    const modalRef = this.modalService.open(
      MaterialEditComponent,
      { size: "lg" }
    );
    await modalRef.result;
  }

  async edit(material: IMaterial) {
    const modalRef = this.modalService.open(
      MaterialEditComponent,
      { size: "lg" }
    );
    modalRef.componentInstance.material = material;
    await modalRef.result;
  }

  async deleteOne(material: IMaterial, procedural = false) {

    if (!procedural) {
      const modalRef = this.modalService.open(AreYouSureComponent);
      await modalRef.result;
      console.log("Delete one", material);
    }

    const id = material.id;
    const foundIndex = this.materials.findIndex(material => material.id === id);
    this.materials.splice(foundIndex, 1);
    this.materials = [ ...this.materials ];
    localStorage.setItem("materials", JSON.stringify(this.materials));
  }

  async deleteMany() {

    const modalRef = this.modalService.open(AreYouSureComponent);
    await modalRef.result;
    console.log("Delete many", this.dt.selectedRows);

    for (const material of this.dt.selectedRows) {
      this.deleteOne(material, true);
    }
  }
}
