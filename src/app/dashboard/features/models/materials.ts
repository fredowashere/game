export interface ICoord {
    x: number;
    y: number;
}

export interface IMaterial {
    id?: number;
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

export interface IMaterials {
    [key: number]: IMaterial;
}

export const DEFAULT_MATERIALS: IMaterials = {
    0: {
        "name": "Outer Space",
        "color": "rgba(51,51,51,1)",
        "solid": false,
        "id": 0
    },
    1: {
        "name": "Air",
        "color": "rgba(136,136,136,1)",
        "solid": false,
        "id": 1
    },
    2: {
        "name": "Wall",
        "color": "rgba(85,85,85,1)",
        "solid": true,
        "bounce": 0.35,
        "id": 2
    },
    3: {
        "id": 3,
        "name": "Water",
        "color": "rgba(121, 220, 242, 0.4)",
        "friction": {
            "x": 0.9,
            "y": 0.9
        },
        "gravity": {
            "x": 0,
            "y": 0.1
        },
        "jump": true,
        "fore": true
    },
    4: {
        "name": "Airscalator",
        "color": "rgba(119,119,119,1)",
        "jump": true,
        "id": 4
    },
    5: {
        "id": 5,
        "name": "Bouncing Carpet",
        "color": "rgba(227,115,250,1)",
        "solid": true,
        "bounce": 1.1
    },
    6: {
        "name": "Dampening Carpet",
        "color": "rgba(102,102,102,1)",
        "solid": true,
        "bounce": 0,
        "id": 6
    },
    7: {
        "id": 7,
        "name": "Change Color",
        "color": "rgba(115,198,250,1)",
        "solid": false,
        "script": "this.player.color = \"#\"+(Math.random()*0xFFFFFF<<0).toString(16);"
    },
    8: {
        "id": 8,
        "name": "Next Level",
        "color": "rgba(250,223,115,1)",
        "solid": false,
        "script": "alert(\"You won! Reloading map.\");\nthis.loadMap(this.currentMap);"
    },
    9: {
        "id": 9,
        "name": "Death",
        "color": "rgba(201,50,50,1)",
        "solid": false,
        "script": "alert(\"You died!\");\nthis.loadMap(this.currentMap);"
    },
    10: {
        "name": "Fake Wall",
        "color": "rgba(85,85,85,1)",
        "solid": true,
        "id": 10
    },
    11: {
        "id": 11,
        "name": "Unlock",
        "color": "rgba(0,255,255,1)",
        "solid": false,
        "script": "this.currentMap.materials[10].solid = 0;\nthis.currentMap.materials[10].color = \"#888\";"
    }
};