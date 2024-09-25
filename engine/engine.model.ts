export interface IMap {
    tileSize: 16,
    materials: { [key: number]: Material };
    data: number[][];
    gravity: Coord2D;
    velocityLimit: Coord2D;
    movementSpeed: Coord2D;
    playerPosition: Coord2D;
    playerColor: string;
    scripts: { [key: string]: string };
}

export interface Material {
    color: string;
    solid: 1|0;
    bounce: number;
    jump: 1|0;
    friction: Coord2D;
    gravity: Coord2D;
    foreground: 1|0;
    script: string;
}

export type Coord2D = [ number, number ];