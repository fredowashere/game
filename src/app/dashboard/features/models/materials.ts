export interface ICoord {
    x: number;
    y: number;
}

export interface IMaterial {
    id: number;         // an integer that corresponds with a tile in the data array.
    color: string;      // any javascript compatible color variable.
    name?: string;      // a string that briefly describes the material
    solid?: boolean;    // whether the tile is solid or not, defaults to false.
    bounce?: number;    // how much velocity is preserved upon hitting the tile, 0.5 is half.
    jump?: boolean;     // whether the player can jump while over the tile, defaults to false.
    friction?: ICoord;  // friction of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    gravity?: ICoord;   // gravity of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
    fore?: boolean;     // whether the tile is drawn in front of the player, defaults to false.
    script?: string;    // refers to a script in the scripts section, executed if it is touched.
}

export const DEFAULT_MATERIALS = [
    { id: 0, name: "Empty Space", color: '#333', solid: false },
    { id: 1, name: "Wall", color: '#888', solid: false },
    { id: 2, name: "Bouncing Carpet", color: '#555', solid: true, bounce: 0.35 },
    { id: 3, name: "Water", color: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: true, fore: true },
    { id: 4, name: "", color: '#777', jump: true },
    { id: 5, name: "", color: '#E373FA', solid: true, bounce: 1.1 },
    { id: 6, name: "", color: '#666', solid: true, bounce: 0 },
    { id: 7, name: "Change Color", color: '#73C6FA', solid: false, script: 'game.player.color = "#"+(Math.random()*0xFFFFFF<<0).toString(16);' },
    { id: 8, name: "Next Level", color: '#FADF73', solid: false, script: 'alert("You won! Reloading map.");\ngame.load_map(map);' },
    { id: 9, name: "Death", color: '#C93232', solid: false, script: 'alert("You died!");\ngame.load_map(map);' },
    { id: 10, name: "", color: '#555', solid: true},
    { id: 11, name: "Unlock", color: '#0FF', solid: false, script: 'game.current_map.keys[10].solid = 0;\ngame.current_map.keys[10].color = "#888";' }
];