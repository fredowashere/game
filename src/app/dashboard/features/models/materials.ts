export interface ICoord {
    x: number;
    y: number;
}

export interface IMaterial {
    id: number;         // an integer that corresponds with a tile in the data array.
    color: string;      // any javascript compatible colour variable.
    name?: string;      // a string that briefly describes the material
    solid?: boolean;    // whether the tile is solid or not, defaults to false.
    bounce?: number;    // how much velocity is preserved upon hitting the tile, 0.5 is half.
    jump?: boolean;     // whether the player can jump while over the tile, defaults to false.
    friction?: ICoord;  // friction of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    gravity?: ICoord;   // gravity of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    fore?: boolean;     // whether the tile is drawn in front of the player, defaults to false.
    script?: string;    // refers to a script in the scripts section, executed if it is touched.
}