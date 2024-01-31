import { Injectable } from "@angular/core";
import { DEFAULT_MATERIALS, IMaterial, IMaterials } from "../models/materials";
import { BehaviorSubject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class MaterialService {

    materials$ = new BehaviorSubject<IMaterial[]>([]);

    constructor() {
        this.materials$.next(this.getSortedArray(this.getAll()));
    }

    getNewId(materials: IMaterials) {
        const ids = Object.keys(materials) as unknown as number[];
        const highestId = Math.max(...ids);
        return highestId + 1;
    }

    getSortedArray(materials: IMaterials) {
        return Object.values(materials).sort((a, b) => b.id - a.id);
    }

    getAll() {
        const materials = localStorage.getItem("materials");
        return (materials ? JSON.parse(materials) : {}) as IMaterials;
    }

    create(newMaterial: IMaterial) {
        const materials = this.getAll();
        const newId = this.getNewId(materials);
        newMaterial.id = newId;
        const newMaterials = { ...materials, [newId]: newMaterial };
        localStorage.setItem("materials", JSON.stringify(newMaterials));
        this.materials$.next(this.getSortedArray(newMaterials));
        return newMaterials;
    }

    update(oldMaterial: IMaterial, newMaterial: IMaterial) {
        const materials = this.getAll();
        newMaterial.id = oldMaterial.id;
        const newMaterials = { ...materials, [oldMaterial.id!]: newMaterial };
        localStorage.setItem("materials", JSON.stringify(newMaterials));
        this.materials$.next(this.getSortedArray(newMaterials));
        return newMaterials;
    }

    delete(materialId: number) {
        const newMaterials = this.getAll();
        delete newMaterials[materialId];
        localStorage.setItem("materials", JSON.stringify(newMaterials));
        this.materials$.next(this.getSortedArray(newMaterials));
        return newMaterials;
    }

    resetToFactory() {
        localStorage.setItem("materials", JSON.stringify(DEFAULT_MATERIALS));
        this.materials$.next(this.getSortedArray(DEFAULT_MATERIALS));
        return DEFAULT_MATERIALS;
    }
}