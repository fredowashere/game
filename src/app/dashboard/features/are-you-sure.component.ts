import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-are-you-sure',
    standalone: true,
    imports: [ CommonModule ],
    template: `

        <div class="modal-header">
            <h4 class="modal-title" id="modal-title">Delete</h4>
            <button
                type="button"
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">
            <p><strong>Are you sure you want to continue with the deletion?</strong></p>
            <p>All information will be permanently deleted.<br><span class="text-danger">This operation can not be undone.</span></p>
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