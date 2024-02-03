import { Injectable } from "@angular/core";
import { DEFAULT_MATERIALS, IMaterial, IMaterials } from "../models/materials";
import { LevelService } from "./level.service";

@Injectable({
    providedIn: "root"
})
export class MaterialService {

    constructor(
        private levelService: LevelService
    ) { }

    getNewId(materials: IMaterials) {
        const ids = Object.keys(materials) as unknown as number[];
        const highestId = Math.max(...ids);
        return highestId + 1;
    }

    getSortedArray(materials: IMaterials) {
        return Object.values(materials).sort((a, b) => b.id - a.id);
    }

    getAll(levelId: number) {
        const level = this.levelService.getById(levelId);
        return level.materials || {};
    }

    getById(levelId: number, materialId: number) {
        return this.getAll(levelId)[materialId];
    }

    create(levelId: number, newMaterial: IMaterial) {
        const level = this.levelService.getById(levelId);
        newMaterial.id = this.getNewId(level.materials);
        level.materials = { ...level.materials, [newMaterial.id]: newMaterial };
        this.levelService.update(level, level);
        return newMaterial.id;
    }

    update(levelId: number, oldMaterial: IMaterial, newMaterial: IMaterial) {
        const level = this.levelService.getById(levelId);
        newMaterial.id = oldMaterial.id;
        level.materials = { ...level.materials, [newMaterial.id!]: newMaterial };
        this.levelService.update(level, level);
        return newMaterial.id;
    }

    delete(levelId: number, materialId: number) {
        const level = this.levelService.getById(levelId);
        delete level.materials[materialId];
        this.levelService.update(level, level);
        return materialId;
    }

    resetToFactory(levelId: number) {
        const level = this.levelService.getById(levelId);
        level.materials = DEFAULT_MATERIALS;
        this.levelService.update(level, level);
    }
}