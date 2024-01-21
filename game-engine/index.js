/* Customisable map data */
const map = {

    tileSize: 16,

    /*
        Key variables:
            id       [required] - an integer that corresponds with a tile in the data array.
            color   [required] - any javascript compatible color variable.
            solid    [optional] - whether the tile is solid or not, defaults to false.
            bounce   [optional] - how much velocity is preserved upon hitting the tile, 0.5 is half.
            jump     [optional] - whether the player can jump while over the tile, defaults to false.
            friction [optional] - friction of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
            gravity  [optional] - gravity of the tile, must have X and Y values (e.g {x:0.5, y:0.5}).
            fore     [optional] - whether the tile is drawn in front of the player, defaults to false.
            script   [optional] - refers to a script in the scripts section, executed if it is touched.
    */
    keys: [
        { id: 0, color: '#333', solid: 0 },
        { id: 1, color: '#888', solid: 0 },
        { id: 2, color: '#555', solid: 1, bounce: 0.35 },
        { id: 3, color: 'rgba(121, 220, 242, 0.4)', friction: { x: 0.9, y: 0.9 }, gravity: { x: 0, y: 0.1 }, jump: 1, fore: 1 },
        { id: 4, color: '#777', jump: 1},
        { id: 5, color: '#E373FA', solid: 1, bounce: 1.1},
        { id: 6, color: '#666', solid: 1, bounce: 0},
        { id: 7, color: '#73C6FA', solid: 0, script: 'changeColor' },
        { id: 8, color: '#FADF73', solid: 0, script: 'nextLevel' },
        { id: 9, color: '#C93232', solid: 0, script: 'death' },
        { id: 10, color: '#555', solid: 1 },
        { id: 11, color: '#0FF', solid: 0, script: 'unlock' }
    ],

    /* An array representing the map tiles. Each number corresponds to a key */
    data: [
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 6, 6, 6, 6, 6, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 7, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 4, 2, 2, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2, 2, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 4, 2, 1, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [2, 1, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [2, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2],
        [2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 8, 1, 1, 1, 2],
        [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
        [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 9, 9, 9, 2, 10, 10, 10, 10, 10, 10, 1, 1, 1, 1, 1, 1, 1, 11, 2, 2, 2, 2, 4, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 10, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 1, 1, 1, 1, 1, 1, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2],
        [2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 6, 6, 6, 2, 2, 2, 2, 2, 2, 6, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
        [2, 1, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 5, 5, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 5, 5, 5, 1, 1, 1, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]
    ],

    /* Default gravity of the map */
    gravity: { x: 0, y: 0.3 },
    
    /* Velocity limits */
    velLimit: { x: 2, y: 16 },

    /* Movement speed when the key is pressed */
    movementSpeed: { jump: 6, left: 0.3, right: 0.3 },
    
    /* The coordinates at which the player spawns and the color of the player */
    player: { x: 2, y: 2, color: '#FF9900' },
    
    /* Scripts refered to by the "script" variable in the tile keys */
    scripts: {
        changeColor: 'game.player.color = "#"+(Math.random()*0xFFFFFF<<0).toString(16);',
        nextLevel: 'alert("Yay! You won! Reloading map."); game.loadMap(map);',
        death: 'alert("You died!"); game.loadMap(map);',
        unlock: 'game.currentMap.keys[10].solid = 0; game.currentMap.keys[10].color = "#888";'
    }
};

/* Clarity engine */
const Clarity = function () {

    this.alertErrors   = false;
    this.logInfo       = true;
    this.tileSize      = 16;
    this.limitViewport = false;
    this.jumpSwitch    = 0;
    
    this.viewport = { x: 200, y: 200 };
    
    this.camera = { x: 0, y: 0 };
    
    this.key = { left: false, right: false, up: false };

    this.player = {
        loc: { x: 0, y: 0 },
        vel: { x: 0, y: 0 },
        canJump: true
    };

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup   = this.keyup.bind(this);
};

Clarity.prototype.error = function (message) {
    if (this.alertErrors) alert(message);
    if (this.logInfo) console.log(message);
};

Clarity.prototype.log = function (message) {
    if (this.logInfo) console.log(message);
};

Clarity.prototype.setViewport = function (x, y) {
    this.viewport.x = x;
    this.viewport.y = y;
};

Clarity.prototype.keydown = function (e) {

    const _this = this;

    switch (e.keyCode) {
    case 37:
        _this.key.left = true;
        break;
    case 38:
        _this.key.up = true;
        break;
    case 39:
        _this.key.right = true;
        break;
    }
};

Clarity.prototype.keyup = function (e) {

    const _this = this;

    switch (e.keyCode) {
    case 37:
        _this.key.left = false;
        break;
    case 38:
        _this.key.up = false;
        break;
    case 39:
        _this.key.right = false;
        break;
    }
};

Clarity.prototype.constructHtmlMap = function(world) {

    for (let i = 0; i < mapWidth; i++) {

        const row = document.createElement("DIV");
        row.classList.add("row");

        for (let j = 0; j < mapHeight; j++) {

          const tile = document.createElement("DIV");
          tile.classList.add("tile");

          row.appendChild(tile);
        }

        world.appendChild(row);
    }

    this.htmlMap = [ ...[ ...world.querySelectorAll(".row") ].map(row => row.querySelectorAll(".tile")) ];
}

Clarity.prototype.loadMap = function (world, player, map) {

    this.htmlPlayer = player;

    this.constructHtmlMap(world);

    if (
        typeof map      === 'undefined'
     || typeof map.data === 'undefined'
     || typeof map.keys === 'undefined'
    ) {
        this.error('Error: Invalid map data!');
        return false;
    }

    this.currentMap = map;

    this.currentMap.background = map.background || '#333';
    this.currentMap.gravity = map.gravity || { x: 0, y: 0.3 };
    this.tileSize = map.tileSize || 16;

    const _this = this;
    
    this.currentMap.width = 0;
    this.currentMap.height = 0;

    map.keys.forEach(function (key) {
        map.data.forEach(function (row, y) {
            _this.currentMap.height = Math.max(_this.currentMap.height, y);
            row.forEach(function (tile, x) {
                _this.currentMap.width = Math.max(_this.currentMap.width, x);
                if (tile == key.id) {
                    _this.currentMap.data[y][x] = key;
                    _this.htmlMap[y][x].style.backgroundColor = _this.currentMap.data[y][x].color;
                }
            });
        });
    });
    
    this.currentMap.widthP = this.currentMap.width * this.tileSize;
    this.currentMap.heightP = this.currentMap.height * this.tileSize;

    this.player.loc.x = map.player.x * this.tileSize || 0;
    this.player.loc.y = map.player.y * this.tileSize || 0;
    this.player.color = map.player.color || '#000';
  
    this.key.left  = false;
    this.key.up    = false;
    this.key.right = false;
    
    this.camera = { x: 0, y: 0 };
    
    this.player.vel = { x: 0, y: 0 };

    this.log('Successfully loaded map data.');

    return true;
};

Clarity.prototype.getTile = function (x, y) {
    return (this.currentMap.data[y] && this.currentMap.data[y][x]) ? this.currentMap.data[y][x] : 0;
};

Clarity.prototype.drawTile = function (x, y, tile) {

    if (!tile || !tile.color) return;

    const htmlTile = this.htmlMap[y][x];
    htmlTile.style.backgroundColor = tile.color;
};

Clarity.prototype.drawMap = function () {
    let y = (this.camera.y / this.tileSize) | 0;
    const height = (this.camera.y + this.viewport.y + this.tileSize) / this.tileSize;
    for (; y < height; y++) {
        let x = (this.camera.x / this.tileSize) | 0;
        const width = (this.camera.x + this.viewport.x + this.tileSize) / this.tileSize;
        for (; x < width; x++) {
            const tile = this.getTile(x, y) || map.keys[0];
            this.drawTile(x, y, tile);
        }
    }
};

Clarity.prototype.movePlayer = function () {

    const tX = this.player.loc.x + this.player.vel.x;
    const tY = this.player.loc.y + this.player.vel.y;

    const offset = Math.round((this.tileSize / 2) - 1);

    const tile = this.getTile(
        Math.round(this.player.loc.x / this.tileSize),
        Math.round(this.player.loc.y / this.tileSize)
    );
     
    if (tile.gravity) {
        this.player.vel.x += tile.gravity.x;
        this.player.vel.y += tile.gravity.y;
    }
    else {
        this.player.vel.x += this.currentMap.gravity.x;
        this.player.vel.y += this.currentMap.gravity.y;
    }
    
    if (tile.friction) {
        this.player.vel.x *= tile.friction.x;
        this.player.vel.y *= tile.friction.y;
    }

    const tYUp   = Math.floor(tY / this.tileSize);
    const tYDown = Math.ceil(tY / this.tileSize);
    const yNear1 = Math.round((this.player.loc.y - offset) / this.tileSize);
    const yNear2 = Math.round((this.player.loc.y + offset) / this.tileSize);

    const tXLeft  = Math.floor(tX / this.tileSize);
    const tXRight = Math.ceil(tX / this.tileSize);
    const xNear1  = Math.round((this.player.loc.x - offset) / this.tileSize);
    const xNear2  = Math.round((this.player.loc.x + offset) / this.tileSize);

    const top1    = this.getTile(xNear1, tYUp);
    const top2    = this.getTile(xNear2, tYUp);
    const bottom1 = this.getTile(xNear1, tYDown);
    const bottom2 = this.getTile(xNear2, tYDown);
    const left1   = this.getTile(tXLeft, yNear1);
    const left2   = this.getTile(tXLeft, yNear2);
    const right1  = this.getTile(tXRight, yNear1);
    const right2  = this.getTile(tXRight, yNear2);

    if (tile.jump && this.jumpSwitch > 15) {
        this.player.canJump = true;
        this.jumpSwitch = 0;
    }
    else {
        this.jumpSwitch++;
    }
    
    this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.currentMap.velLimit.x), this.currentMap.velLimit.x);
    this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.currentMap.velLimit.y), this.currentMap.velLimit.y);
    
    this.player.loc.x += this.player.vel.x;
    this.player.loc.y += this.player.vel.y;
    
    this.player.vel.x *= .9;
    
    if (left1.solid || left2.solid || right1.solid || right2.solid) {

        /* Fix overlap */
        while (
            this.getTile(Math.floor(this.player.loc.x / this.tileSize), yNear1).solid
         || this.getTile(Math.floor(this.player.loc.x / this.tileSize), yNear2).solid
        ) {
            this.player.loc.x += 0.1;
        }

        while (
            this.getTile(Math.ceil(this.player.loc.x / this.tileSize), yNear1).solid
         || this.getTile(Math.ceil(this.player.loc.x / this.tileSize), yNear2).solid
        ) {
            this.player.loc.x -= 0.1;
        }

        /* Tile bounce */
        let bounce = 0;
        if (left1.solid  && left1.bounce > bounce)  bounce = left1.bounce;
        if (left2.solid  && left2.bounce > bounce)  bounce = left2.bounce;
        if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
        if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;

        this.player.vel.x *= -bounce || 0;
    }
    
    if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {

        /* Fix overlap */
        while (
            this.getTile(xNear1, Math.floor(this.player.loc.y / this.tileSize)).solid
         || this.getTile(xNear2, Math.floor(this.player.loc.y / this.tileSize)).solid
        ) {
            this.player.loc.y += 0.1;
        }

        while (
            this.getTile(xNear1, Math.ceil(this.player.loc.y / this.tileSize)).solid
         || this.getTile(xNear2, Math.ceil(this.player.loc.y / this.tileSize)).solid
        ) {
            this.player.loc.y -= 0.1;
        }

        /* Tile bounce */
        let bounce = 0;
        if (top1.solid    && top1.bounce > bounce)    bounce = top1.bounce;
        if (top2.solid    && top2.bounce > bounce)    bounce = top2.bounce;
        if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
        if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;
        
        this.player.vel.y *= -bounce || 0;

        if ((bottom1.solid || bottom2.solid) && !tile.jump) {
            this.player.onFloor = true;
            this.player.canJump = true;
        }
    }
    
    /* Adjust the camera */
    const cX = Math.round(this.player.loc.x - this.viewport.x / 2);
    const cY = Math.round(this.player.loc.y - this.viewport.y / 2);
    const xDiff = Math.abs(cX - this.camera.x);
    const yDiff = Math.abs(cY - this.camera.y);
    
    if (xDiff > 5) {
        const mag = Math.round(Math.max(1, xDiff * 0.1));
        if (cX != this.camera.x) {
            this.camera.x += cX > this.camera.x ? mag : -mag;
            if (this.limitViewport) {
                this.camera.x = Math.min(this.currentMap.widthP - this.viewport.x + this.tileSize, this.camera.x);
                this.camera.x = Math.max(0, this.camera.x);
            }
        }
    }
    
    if (yDiff > 5) {
        const mag = Math.round(Math.max(1, yDiff * 0.1));
        if (cY != this.camera.y) {
            this.camera.y += cY > this.camera.y ? mag : -mag;
            if (this.limitViewport) {
                this.camera.y = Math.min(this.currentMap.heightP - this.viewport.y + this.tileSize, this.camera.y);
                this.camera.y = Math.max(0, this.camera.y);
            }
        }
    }

    worldWrap.scrollTo(this.camera.x, this.camera.y)
    
    if (this.lastTile != tile.id && tile.script) {
        eval(this.currentMap.scripts[tile.script]);
    }
    
    this.lastTile = tile.id;
};

Clarity.prototype.updatePlayer = function () {

    if (this.key.left) {
        if (this.player.vel.x > -this.currentMap.velLimit.x) {
            this.player.vel.x -= this.currentMap.movementSpeed.left;
        }
    }

    if (this.key.up) {
        if (this.player.canJump && this.player.vel.y > -this.currentMap.velLimit.y) {
            this.player.vel.y -= this.currentMap.movementSpeed.jump;
            this.player.canJump = false;
        }
    }

    if (this.key.right) {
        if (this.player.vel.x < this.currentMap.velLimit.x) {
            this.player.vel.x += this.currentMap.movementSpeed.left;
        }
    }

    this.movePlayer();
};

Clarity.prototype.drawPlayer = function () {
    this.htmlPlayer.style.backgroundColor = this.player.color;
    this.htmlPlayer.style.left = (this.player.loc.x + this.tileSize / 2) + "px";
    this.htmlPlayer.style.top = (this.player.loc.y + this.tileSize / 2) + "px";
};

window.addEventListener("keydown", function(e) {
    if (["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);

const viewportWidth = 576;
const viewportHeight = 576;
const mapWidth = 1e2;
const mapHeight = 1e2;

const worldWrap = document.querySelector(".world-wrap");
const world = document.querySelector(".world");
const player = document.querySelector(".player");

worldWrap.style.width = viewportWidth + "px";
worldWrap.style.height = viewportHeight + "px";

/* Setup of the engine */
function unsupportedAnimFrame(callback) {
    return window.setTimeout(callback, 1000 / 60);
};

window.requestAnimFrame = window.requestAnimationFrame || unsupportedAnimFrame;

// ToDo: Maybe a pre-load step to setup HTML references would be best
// ToDo: What about parametizing the whole HTML creation step and just ask for an HTML point of insertion?

const game = new Clarity();
game.setViewport(viewportWidth, viewportHeight);
game.loadMap(world, player, map);
game.limitViewport = true;

(function loop() {
  game.drawMap();
  game.updatePlayer();
  game.drawPlayer();
  window.requestAnimFrame(loop);
})();
