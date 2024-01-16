import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AreYouSureComponent } from '../are-you-sure.component';
import { IMaterial } from '../models/materials';

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

            <div class="ps-3 mb-3">

                <h5 class="text-uppercase" style="margin-left: -1rem;">Appearance</h5>

                <app-input
                    class="mb-3"
                    type="checkbox"
                    name="fore"
                    label="Fore"
                    helper="Whether the tile is drawn in front of the player, defaults to false."
                    [ngControl]="form.controls.fore"
                    [floatingLabel]="true"
                />
    
                <app-input
                    class="mb-3"
                    name="name"
                    label="Name"
                    helper="A string that briefly describes the material"
                    [ngControl]="form.controls.name"
                    [floatingLabel]="true"
                />
            </div>

            <div class="ps-3 mb-3">

                <h5 class="text-uppercase" style="margin-left: -1rem;">Physics</h5>

                <app-input
                    class="mb-3"
                    type="checkbox"
                    name="solid"
                    label="Solid"
                    helper="Whether the tile is solid or not, defaults to false."
                    [ngControl]="form.controls.solid"
                    [floatingLabel]="true"
                />

                <app-input
                    class="mb-3"
                    type="number"
                    name="bounce"
                    label="Bounce"
                    helper="How much velocity is preserved upon hitting the tile, 0.5 is half."
                    [ngControl]="form.controls.bounce"
                    [floatingLabel]="true"
                />

                <div class="flexgrid flexgrid--2">

                    <app-input
                        type="number"
                        name="frictionx"
                        label="Friction X"
                        helper="X value of the friction of the tile"
                        [ngControl]="form.controls.friction.controls.x"
                        [floatingLabel]="true"
                    />
        
                    <app-input
                        type="number"
                        name="frictiony"
                        label="Friction Y"
                        helper="Y value of the friction of the tile"
                        [ngControl]="form.controls.friction.controls.y"
                        [floatingLabel]="true"
                    />
                </div>

                <div class="flexgrid flexgrid--2">

                    <app-input
                        type="number"
                        name="gravityx"
                        label="Gravity X"
                        helper="X value of the gravity of the tile"
                        [ngControl]="form.controls.gravity.controls.x"
                        [floatingLabel]="true"
                    />
        
                    <app-input
                        type="number"
                        name="gravityy"
                        label="Gravity Y"
                        helper="Y value of the gravity of the tile"
                        [ngControl]="form.controls.gravity.controls.y"
                        [floatingLabel]="true"
                    />
                </div>
            </div>

            <div class="ps-3">

                <h5 class="text-uppercase" style="margin-left: -1rem;">Behavior</h5>

                <app-input
                    class="mb-3"
                    type="checkbox"
                    name="jump"
                    label="Jump"
                    helper="Whether the player can jump while over the tile, defaults to false."
                    [ngControl]="form.controls.jump"
                    [floatingLabel]="true"
                />

                <app-input
                    type="textarea"
                    name="script"
                    label="Script"
                    helper="Refers to a script in the scripts section, executed if it is touched."
                    [ngControl]="form.controls.script"
                    [floatingLabel]="true"
                />
            </div>
        </div>
        
        <div class="modal-footer flex-wrap justify-content-between gap-3">

            <button
                *ngIf="material"
                class="btn btn-danger me-auto"
                (click)="delete()"
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
    styles: [`
        :host ::ng-deep textarea[id*="script"] {
            height: 250px!important;
        }
    `]
})
export class MaterialEditComponent {

    @Input("material") material!: IMaterial;

    form = new FormGroup({
        // Appearance
        name: new FormControl(),
        color: new FormControl(),
        fore: new FormControl(),
        // Physiques
        solid: new FormControl(),
        bounce: new FormControl(),
        friction: new FormGroup({
            x: new FormControl(0),
            y: new FormControl(0)
        }),
        gravity: new FormGroup({
            x: new FormControl(0),
            y: new FormControl(0)
        }),
        // Behavior
        jump: new FormControl(),
        script: new FormControl(),
    });

    constructor(
        private modalService: NgbModal,
        public activeModal: NgbActiveModal
    ) {}

    ngOnInit() {
        if (this.material) {
            this.form.patchValue(this.material);
        }
    }

    async delete() {
        const modalRef = this.modalService.open(AreYouSureComponent);
        await modalRef.result;
        this.activeModal.close('Deleted');
    }
}