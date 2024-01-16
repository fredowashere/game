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

  materials: IMaterial[] = [
    { id: 0, name: "Wall 1", color: '#333', solid: false },
    { id: 1, name: "Wall 2", color: '#888', solid: false },
    { id: 2, name: "", color: '#555', solid: true, bounce: 0.35 },
    { id: 3, name: "", color: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: true, fore: true },
    { id: 4, name: "", color: '#777', jump: true },
    { id: 5, name: "", color: '#E373FA', solid: true, bounce: 1.1 },
    { id: 6, name: "", color: '#666', solid: true, bounce: 0 },
    { id: 7, name: "", color: '#73C6FA', solid: false, script: 'change_color' },
    { id: 8, name: "", color: '#FADF73', solid: false, script: 'next_level' },
    { id: 9, name: "", color: '#C93232', solid: false, script: 'death' },
    { id: 10, name: "", color: '#555', solid: true},
    { id: 11, name: "", color: '#0FF', solid: false, script: 'unlock' }
  ];

  constructor(
    private modalService: NgbModal
  ) { }

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
