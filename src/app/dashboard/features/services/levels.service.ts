import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DEFAULT_LEVELS, ILevel, ILevels } from "../models/levels";

@Injectable({
    providedIn: "root"
})
export class LevelService {

    levels$ = new BehaviorSubject<ILevel[]>([]);

    constructor() {
        this.levels$.next(this.getSortedArray(this.getAll()));
    }

    getNewId(levels: ILevels) {
        const ids = Object.keys(levels) as unknown as number[];
        const highestId = Math.max(...ids);
        return highestId + 1;
    }

    getSortedArray(levels: ILevels) {
        return Object.values(levels).sort((a, b) => b.id - a.id);
    }

    getAll() {
        const levels = localStorage.getItem("levels");
        return (levels ? JSON.parse(levels) : {}) as ILevels;
    }

    create(newLevel: ILevel) {
        const levels = this.getAll();
        const newId = this.getNewId(levels);
        newLevel.id = newId;
        const newLevels = { ...levels, [newId]: newLevel };
        localStorage.setItem("levels", JSON.stringify(newLevels));
        this.levels$.next(this.getSortedArray(newLevels));
        return newLevels;
    }

    update(oldLevel: ILevel, newLevel: ILevel) {
        const levels = this.getAll();
        newLevel.id = oldLevel.id;
        const newLevels = { ...levels, [oldLevel.id!]: newLevel };
        localStorage.setItem("levels", JSON.stringify(newLevels));
        this.levels$.next(this.getSortedArray(newLevels));
        return newLevels;
    }

    delete(levelId: number) {
        const newLevels = this.getAll();
        delete newLevels[levelId];
        localStorage.setItem("levels", JSON.stringify(newLevels));
        this.levels$.next(this.getSortedArray(newLevels));
        return newLevels;
    }

    resetToFactory() {
        localStorage.setItem("levels", JSON.stringify(DEFAULT_LEVELS));
        this.levels$.next(this.getSortedArray(DEFAULT_LEVELS));
        return DEFAULT_LEVELS;
    }
}