import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-are-you-sure',
    standalone: true,
    imports: [ CommonModule ],
    template: `

        <div class="modal-header">
            <h4 class="modal-title" id="modal-title">Confirmation</h4>
            <button
                type="button"
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">
            <div class="text-center fs-5 py-4">
                Are you sure you want to continue?<br>
                <b class="text-danger">This operation can not be undone.</b>
            </div>
        </div>
        
        <div class="modal-footer">
            <button class="btn btn-outline-secondary" (click)="activeModal.dismiss('Dismissed')">Cancel</button>
            <button class="btn btn-danger" (click)="activeModal.close('Confirmed')">Confirm</button>
        </div>
    `,
})
export class AreYouSureComponent {
    constructor(
        public activeModal: NgbActiveModal
    ) {}
}