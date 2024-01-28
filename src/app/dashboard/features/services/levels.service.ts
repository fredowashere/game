import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DEFAULT_LEVEL, ILevel } from "../models/levels";

@Injectable({
    providedIn: "root"
})
export class LevelService {

    levels$ = new BehaviorSubject<ILevel[]>([]);

    constructor() {
        this.levels$.next(this.getAll());
    }

    getAll() {
        const levels = localStorage.getItem("levels");
        return (levels ? JSON.parse(levels) : []) as ILevel[];
    }

    create(newLevel: ILevel) {
        const levels = this.getAll();
        const id = levels[0].id + 1;
        const newLevels = [ { ...newLevel, id }, ...levels ];
        localStorage.setItem("levels", JSON.stringify(newLevels));
        this.levels$.next(newLevels);
        return newLevels;
    }

    update(oldLevel: ILevel, newLevel: ILevel) {
        const levels = this.getAll();
        const id = oldLevel.id;
        const foundIndex = levels.findIndex(m => m.id === id);
        levels.splice(foundIndex, 1, { ...newLevel, id });
        const newLevels = [ ...levels ];
        localStorage.setItem("levels", JSON.stringify(newLevels));
        this.levels$.next(newLevels);
        return newLevels;
    }

    delete(level: ILevel) {
        const levels = this.getAll();
        const id = level.id;
        const foundIndex = levels.findIndex(level => level.id === id);
        levels.splice(foundIndex, 1);
        const newLevels = [ ...levels ];
        localStorage.setItem("levels", JSON.stringify(newLevels));
        this.levels$.next(newLevels);
        return newLevels;
    }

    resetToFactory() {
        localStorage.setItem("levels", JSON.stringify([ DEFAULT_LEVEL ]));
        this.levels$.next([ DEFAULT_LEVEL ]);
        return [ DEFAULT_LEVEL ];
    }
}