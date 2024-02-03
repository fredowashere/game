import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { IMaterial } from '../../../models/materials';

@Component({
    selector: 'app-level-material-edit',
    standalone: true,
    imports: [ CommonModule, SharedModule ],
    template: `
        <div class="modal-header">

            <h4 class="modal-title" id="modal-title">
                <ng-container *ngIf="material; else newMaterial">
                    Edit {{ material.name }}
                    <span class="ms-1" style="display: inline-block; width: 20px; height: 20px;" [style.background]="pickerColor"></span>
                </ng-container>
                <ng-template #newMaterial>
                    Create new material
                </ng-template>
            </h4>

            <button
                class="btn-close" 
                (click)="activeModal.dismiss('Cross click')"
            ></button>
        </div>

        <div class="modal-body">

            <div class="border rounded mb-3">
                <h5 class="text-uppercase border-bottom p-2 mb-0 clickable" (click)="isAppearanceCollapsed = !isAppearanceCollapsed">
                    Appearance
                    <i *ngIf="!isAppearanceCollapsed" class="bi bi-arrows-collapse ms-1"></i>
                    <i *ngIf="isAppearanceCollapsed" class="bi bi-arrows-expand ms-1"></i>
                </h5>
                <div class="p-2 px-3" #appearanceCollapse="ngbCollapse" [(ngbCollapse)]="isAppearanceCollapsed">

                    <span class="mb-3" id="colorPicker">
                        <span [style.background]="pickerColor"></span> {{ pickerColor }}
                    </span>

                    <app-input
                        class="mb-3"
                        type="checkbox"
                        name="fore"
                        label="Fore"
                        helper="Whether the tile is drawn in front of the player, defaults to false."
                        [ngControl]="form.controls.fore"
                    />
        
                    <app-input
                        name="name"
                        label="Name"
                        helper="A string that briefly describes the material"
                        [ngControl]="form.controls.name"
                        [floatingLabel]="true"
                    />
                </div>
            </div>
            
            <div class="border rounded mb-3">
                <h5 class="text-uppercase border-bottom p-2 mb-0 clickable" (click)="isPhysicsCollapsed = !isPhysicsCollapsed">
                    Physics
                    <i *ngIf="!isPhysicsCollapsed" class="bi bi-arrows-collapse ms-1"></i>
                    <i *ngIf="isPhysicsCollapsed" class="bi bi-arrows-expand ms-1"></i>
                </h5>
                <div class="p-2 px-3" #physicsCollapse="ngbCollapse" [(ngbCollapse)]="isPhysicsCollapsed">

                    <app-input
                        class="mb-3"
                        type="checkbox"
                        name="solid"
                        label="Solid"
                        helper="Whether the tile is solid or not, defaults to false."
                        [ngControl]="form.controls.solid"
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

                    <app-input
                        class="mb-1"
                        type="checkbox"
                        name="frictionYes"
                        label="Enable Friction"
                        [ngControl]="form.controls.frictionYes"
                    />

                    <div class="flexgrid flexgrid--2">

                        <app-input
                            type="number"
                            name="frictionx"
                            label="Friction X"
                            helper="X value of the friction of the tile"
                            [ngControl]="form.controls.friction.controls.x"
                            [floatingLabel]="true"
                            [disabled]="!form.controls.frictionYes.value"
                        />
            
                        <app-input
                            type="number"
                            name="frictiony"
                            label="Friction Y"
                            helper="Y value of the friction of the tile"
                            [ngControl]="form.controls.friction.controls.y"
                            [floatingLabel]="true"
                            [disabled]="!form.controls.frictionYes.value"
                        />
                    </div>

                    <app-input
                        class="mb-1"
                        type="checkbox"
                        name="gravityYes"
                        label="Enable Gravity"
                        [ngControl]="form.controls.gravityYes"
                    />

                    <div class="flexgrid flexgrid--2">

                        <app-input
                            type="number"
                            name="gravityx"
                            label="Gravity X"
                            helper="X value of the gravity of the tile"
                            [ngControl]="form.controls.gravity.controls.x"
                            [floatingLabel]="true"
                            [disabled]="!form.controls.gravityYes.value"
                        />
            
                        <app-input
                            type="number"
                            name="gravityy"
                            label="Gravity Y"
                            helper="Y value of the gravity of the tile"
                            [ngControl]="form.controls.gravity.controls.y"
                            [floatingLabel]="true"
                            [disabled]="!form.controls.gravityYes.value"
                        />
                    </div>
                </div>
            </div>

            <div class="border rounded">
                <h5 class="text-uppercase border-bottom p-2 mb-0 clickable" (click)="isBehaviorCollapsed = !isBehaviorCollapsed">
                    Behavior
                    <i *ngIf="!isBehaviorCollapsed" class="bi bi-arrows-collapse ms-1"></i>
                    <i *ngIf="isBehaviorCollapsed" class="bi bi-arrows-expand ms-1"></i>
                </h5>
                <div class="p-2 px-3" #behaviorCollapse="ngbCollapse" [(ngbCollapse)]="isBehaviorCollapsed">

                    <app-input
                        class="mb-3"
                        type="checkbox"
                        name="jump"
                        label="Jump"
                        helper="Whether the player can jump while over the tile, defaults to false."
                        [ngControl]="form.controls.jump"
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
        </div>
        
        <div class="modal-footer flex-wrap justify-content-between gap-3">

            <button
                *ngIf="material"
                class="btn btn-outline-danger"
                [disabled]="[ 1, 2 ].includes(material.id || -1)"
                (click)="delete()"
            >
                <i class="bi bi-trash3"></i> Delete
            </button>
    
            <button
                class="btn btn-primary"
                (click)="save();"
            >
                Save <i class="bi bi-save"></i>
            </button>
        </div>
    `,
    styles: [`

        :host ::ng-deep textarea[id*="script"] {
            height: 250px!important;
        }

        #colorPicker {
            width: 200px;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
        }

        #colorPicker > span {
            display: inline-block;
            width: 20px;
            height: 20px;
        }
    `]
})
export class LevelMaterialEditComponent {

    @Input("material") material!: IMaterial;

    isAppearanceCollapsed = false;
    isPhysicsCollapsed = false;
    isBehaviorCollapsed = false;

    pickerColor = "rgba(0,204,255,1)";

    form = new FormGroup({
        // Appearance
        name: new FormControl(),
        color: new FormControl(this.pickerColor),
        fore: new FormControl(),
        // Physiques
        solid: new FormControl(),
        bounce: new FormControl(),
        frictionYes : new FormControl(false),
        friction: new FormGroup({
            x: new FormControl(0),
            y: new FormControl(0)
        }),
        gravityYes: new FormControl(false),
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
            this.pickerColor = this.material.color;
            this.form.patchValue({
                ...this.material,
                frictionYes: !!this.material.friction,
                gravityYes: !!this.material.gravity
            });
        }
        this.isAppearanceCollapsed = !!this.material;
        this.isPhysicsCollapsed = !!this.material;
    }

    ngAfterViewInit() {
        const pickerParent = document.querySelector("#colorPicker");
        new window.Picker({
            parent: pickerParent,
            defaultColor: this.pickerColor,
            onChange: (color: any) => {
                const rgba = color.rgbaString;
                this.pickerColor = rgba;
                this.form.controls.color.setValue(rgba);
            }
        });
    }

    extractMaterialFromForm() {

        const material = this.form.getRawValue();

        // Remove garbage from material
        if (!material.frictionYes) {
            delete (material as any).friction;
        }
        if (!material.gravityYes) {
            delete (material as any).gravity;
        }
        delete (material as any).frictionYes;
        delete (material as any).gravityYes;

        return material;
    }

    async save() {

        const material = this.extractMaterialFromForm();

        if (this.material) {
            this.activeModal.close({
                operation: "Update",
                old: this.material,
                new: material
            });
        }
        else {
            this.activeModal.close({
                operation: "Create",
                old: null,
                new: material
            });
        }
    }

    async delete() {
        this.activeModal.close({
            operation: "Delete",
            old: this.material,
            new: null
        });
    }
}