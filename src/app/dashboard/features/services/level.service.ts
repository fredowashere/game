import { Injectable } from "@angular/core";
import { DEFAULT_LEVELS, ILevel, ILevels } from "../models/levels";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class LevelService {

    levelsUpdated = new Subject<void>();

    constructor() {}

    writeIntoLS(levels: ILevels) {
        localStorage.setItem("levels", JSON.stringify(levels));
        this.levelsUpdated.next();
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

    getById(levelId: number) {
        return this.getAll()[levelId];
    }

    create(newLevel: ILevel) {
        const levels = this.getAll();
        const newId = this.getNewId(levels);
        newLevel.id = newId;
        const newLevels = { ...levels, [newId]: newLevel };
        this.writeIntoLS(newLevels);
        return newLevel.id;
    }

    update(oldLevel: ILevel, newLevel: ILevel) {
        const levels = this.getAll();
        newLevel.id = oldLevel.id;
        const newLevels = { ...levels, [newLevel.id!]: newLevel };
        this.writeIntoLS(newLevels);
        return newLevel.id;
    }

    delete(levelId: number) {
        const levels = this.getAll();
        delete levels[levelId];
        this.writeIntoLS(levels);
        return levelId;
    }

    resetToFactory() {
        this.writeIntoLS(DEFAULT_LEVELS);
    }
}