import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreYouSureComponent } from '../are-you-sure.component';

@Component({
    selector: 'app-material-edit',
    standalone: true,
    imports: [ CommonModule, SharedModule ],
    template: `
        <div class="modal-header">

            <h4 class="modal-title" id="modal-title">
                {{ material ? 'Edit ' + material.name : 'Create new material' }}
            </h4>

            <button
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">
            <form class="d-grid gap-2">

            </form>
        </div>
        
        <div class="modal-footer flex-wrap justify-content-between gap-3">

            <button
                *ngIf="material"
                class="btn btn-danger me-auto"
                (click)="confirmDelete()"
            >
                Delete
            </button>

            <div class="d-flex flex-wrap gap-3">

                <button
                    class="btn btn-outline-secondary"
                    (click)="activeModal.dismiss('Cancel')"
                >
                    Cancel
                </button>
    
                <button
                    class="btn btn-primary"
                    (click)="activeModal.close('Save')"
                >
                    Save
                </button>
            </div>
        </div>
    `,
})
export class MaterialEditComponent {

    @Input("material") material!: any; // ToDo: Type this

    form = new FormGroup({});

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal
    ) {}

    async confirmDelete() {
        const modalRef = this.modalService.open(AreYouSureComponent);
        await modalRef.result;
        this.activeModal.close('Deleted');
    }
}