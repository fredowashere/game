import { Component, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from 'src/app/shared/components/table/table.component';
import { ToastService } from 'src/app/services/toast.service';
import { DEFAULT_MATERIALS, IMaterial } from '../../../models/materials';
import { AreYouSureComponent } from '../../../are-you-sure.component';
import { MaterialEditComponent } from '../../../materials-editor/material-edit-dialog.component';

@Component({
  selector: 'app-map-materials',
  templateUrl: './map-materials.component.html',
  styleUrls: ['./map-materials.component.css']
})
export class MapMaterialsComponent {

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
    const results = await modalRef.result;
    console.log(results);

    const id = this.materials[0].id + 1;
    this.materials = [ { ...results.new, id }, ...this.materials ];
    localStorage.setItem("materials", JSON.stringify(this.materials));
  }

  async edit(material: IMaterial) {

    const modalRef = this.modalService.open(
      MaterialEditComponent,
      { size: "lg" }
    );
    modalRef.componentInstance.material = material;
    const results = await modalRef.result;
    console.log(results);

    if (results.operation === "Delete") {
      return this.deleteOne(results.old);
    }

    const id = results.old.id;
    const foundIndex = this.materials.findIndex(material => material.id === id);
    this.materials.splice(foundIndex, 1, { ...results.new, id });
    this.materials = [ ...this.materials ];
    localStorage.setItem("materials", JSON.stringify(this.materials));
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
