export interface IMap {
    tileSize: 16,
    materials: { [key: number]: Material };
    data: number[][];
    gravity: Coord2D;
    velocityLimit: Coord2D;
    movementSpeed: Coord2D;
    playerPosition: Coord2D;
    playerColor: string;
    background: string;
    scripts: { [key: string]: string };
    
    dataMaterial?: Material[][];
    height?: number;
    pxHeight?: number;
    width?: number;
    pxWidth?: number;
}

export interface Material {
    id: number;
    color: string;
    solid: 1|0;
    bounce: number;
    jump: 1|0;
    friction: Coord2D;
    foreground: 1|0;
    script: string;
    gravity?: Coord2D;
}

export type Coord2D = [ number, number ];