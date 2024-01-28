import { Injectable } from "@angular/core";
import { DEFAULT_MATERIALS, IMaterial } from "../models/materials";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class MaterialService {

    materials$ = new BehaviorSubject<IMaterial[]>([]);

    constructor() {
        this.materials$.next(this.getAll());
    }

    getAll() {
        const materials = localStorage.getItem("materials");
        return (materials ? JSON.parse(materials) : []) as IMaterial[];
    }

    create(newMaterial: IMaterial) {
        const materials = this.getAll();
        const id = materials[0].id + 1;
        const newMaterials = [ { ...newMaterial, id }, ...materials ];
        localStorage.setItem("materials", JSON.stringify(newMaterials));
        this.materials$.next(newMaterials);
        return newMaterials;
    }

    update(oldMaterial: IMaterial, newMaterial: IMaterial) {
        const materials = this.getAll();
        const id = oldMaterial.id;
        const foundIndex = materials.findIndex(m => m.id === id);
        materials.splice(foundIndex, 1, { ...newMaterial, id });
        const newMaterials = [ ...materials ];
        localStorage.setItem("materials", JSON.stringify(newMaterials));
        this.materials$.next(newMaterials);
        return newMaterials;
    }

    delete(material: IMaterial) {
        const materials = this.getAll();
        const id = material.id;
        const foundIndex = materials.findIndex(material => material.id === id);
        materials.splice(foundIndex, 1);
        const newMaterials = [ ...materials ];
        localStorage.setItem("materials", JSON.stringify(newMaterials));
        this.materials$.next(newMaterials);
        return newMaterials;
    }

    resetToFactory() {
        localStorage.setItem("materials", JSON.stringify(DEFAULT_MATERIALS));
        this.materials$.next(DEFAULT_MATERIALS);
        return DEFAULT_MATERIALS;
    }
}