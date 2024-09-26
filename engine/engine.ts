import { Coord2D, IMap, Material } from "./engine.model";
import { fastFloor, fastRound } from "./engine.util";

export class Engine {
    tileSize: 8|16|24|32;
    limitViewport: 1|0;
    jumpSwitch: 1|0;
    viewport: Coord2D;
    camera: Coord2D;
    playerPosition: Coord2D;
    playerVelocity: Coord2D;
    playerColor: string;
    canJump: 1|0;
    keyLeft: 1|0;
    keyRight: 1|0;
    keyUp: 1|0;

    currentMap?: IMap;
    context?: CanvasRenderingContext2D;
    lastTile?: Material;

    constructor() {
        this.tileSize = 16;
        this.limitViewport = 0;
        this.jumpSwitch = 0;
        this.viewport = [200, 200];
        this.camera = [0, 0];
        this.playerPosition = [0, 0];
        this.playerVelocity = [0, 0];
        this.playerColor = "#FF9900";
        this.canJump = 1;
        this.keyLeft = 0;
        this.keyRight = 0;
        this.keyUp = 0;

        window.onkeydown = (e: KeyboardEvent) => this.keydown(e);
        window.onkeyup = (e: KeyboardEvent) => this.keyup(e);
    }

    keydown(e: KeyboardEvent) {
        switch (e.keyCode) {
            case 37:
                this.keyLeft = 1;
                break;
            case 38:
                this.keyUp = 1;
                break;
            case 39:
                this.keyRight = 1;
                break;
        }
    }

    keyup(e: KeyboardEvent) {
        switch (e.keyCode) {
            case 37:
                this.keyLeft = 0;
                break;
            case 38:
                this.keyUp = 0;
                break;
            case 39:
                this.keyRight = 0;
                break;
        }
    }

    getMaterial(gX: number, gY: number) {
        return this.currentMap?.dataMaterial?.[gY]?.[gX];
    }

    drawTile(x: number, y: number, tile: Material) {
        this.context!.fillStyle = tile.color;
        this.context!.fillRect(x, y, this.tileSize, this.tileSize);
    }

    drawPlayer() {
        this.context!.fillStyle = this.playerColor;
        this.context!.beginPath();
        this.context!.arc(
            this.playerPosition[0] + this.tileSize / 2 - this.camera[0],
            this.playerPosition[1] + this.tileSize / 2 - this.camera[1],
            this.tileSize / 2 - 1,
            0,
            Math.PI * 2
        );
        this.context!.fill();
    }

    drawMap(foreground = 0) {
        const startY = fastFloor(this.camera[1] / this.tileSize);
        const endY = (this.camera[1] + this.viewport[1] + this.tileSize) / this.tileSize;

        for (let y = startY; y < endY; y++) {
            const startX = fastFloor(this.camera[0] / this.tileSize);
            const endX = (this.camera[0] + this.viewport[0] + this.tileSize) / this.tileSize;

            for (let x = startX; x < endX; x++) {
                const tile = this.getMaterial(x, y);

                if (foreground === tile?.foreground) {
                    const tX = (x * this.tileSize) - this.camera[0];
                    const tY = (y * this.tileSize) - this.camera[1];
                    
                    this.drawTile(tX, tY, tile);
                }
            }
        }

        if (foreground === 0) {
            this.drawMap(1);
        }
    }

    updatePlayer() {
        if (this.keyLeft && this.playerVelocity[0] > -this.currentMap!.velocityLimit[0]) {
            this.playerVelocity[0] -= this.currentMap!.movementSpeed[0];
        }

        if (this.keyRight && this.playerVelocity[0] < this.currentMap!.velocityLimit[0]) {
            this.playerVelocity[0] += this.currentMap!.movementSpeed[0];
        }
    
        if (this.keyUp && this.canJump && this.playerVelocity[1] > -this.currentMap!.velocityLimit[1]) {
            this.playerVelocity[1] -= this.currentMap!.movementSpeed[1];
            this.canJump = 0;
        }
    }

    loadMap(map: IMap) {
        this.currentMap = map;
   
        this.currentMap.background = map.background || "#333";
        this.currentMap.gravity = map.gravity || [0, 0.3];
        this.tileSize = map.tileSize || 16;

        this.currentMap.width = 0;
        this.currentMap.height = 0;
        this.currentMap.dataMaterial = this.currentMap.data as [][];

        for (const key in map.materials) {
            const matIdx = Number(key);
            const material = map.materials[matIdx];

            for (let y = 0; y < map.data.length; y++) {
                this.currentMap.height = Math.max(this.currentMap.height, y);

                for (let x = 0; x < map.data[y].length; x++) {
                    this.currentMap.width = Math.max(this.currentMap.width, x);

                    if (map.data[y][x] === matIdx) {
                        this.currentMap.dataMaterial[y][x] = material;
                    }
                }
            }
        }
       
        this.currentMap.pxWidth = this.currentMap.width * this.tileSize;
        this.currentMap.pxHeight = this.currentMap.height * this.tileSize;

        this.playerPosition[0] = map.playerPosition[0] * this.tileSize || 0;
        this.playerPosition[1] = map.playerPosition[1] * this.tileSize || 0;
        this.playerColor = map.playerColor || "#000";

        this.keyLeft = 0;
        this.keyUp = 0;
        this.keyRight = 0;

        this.camera = [0, 0];
        this.playerVelocity = [0, 0];

        return true;
    }

    getMaterialPixelCoords(gX: number, gY: number) {
        const offset = fastRound((this.tileSize / 2) - 1);
        const pX = gX * this.tileSize;
        const pY = gY * this.tileSize;

        const topLeft = [pX - offset, pY - offset];
        const topRight = [pX + offset, pY - offset];
        const bottomRight = [pX + offset, pY + offset];
        const bottomLeft = [pX - offset, pY + offset];

        return [
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        ];
    }

    movePlayer() {
        const tile = this.getMaterial(
            fastRound(this.playerPosition[0] / this.tileSize),
            fastRound(this.playerPosition[1] / this.tileSize)
        );
        
        // Apply gravity
        if(tile?.gravity) {
            this.playerVelocity[0] += tile.gravity[0];
            this.playerVelocity[1] += tile.gravity[1];
        } else {
            this.playerVelocity[0] += this.currentMap!.gravity[0];
            this.playerVelocity[1] += this.currentMap!.gravity[1];
        }
        
        // Apply friction
        if (tile?.friction) {
            this.playerVelocity[0] *= tile.friction[0];
            this.playerVelocity[0] *= tile.friction[1];
        }

        if (tile?.jump && this.jumpSwitch > 15) {
            this.canJump = 1;
            this.jumpSwitch = 0;
        } else {
            this.jumpSwitch++
        };
        
        // Apply forces
        this.playerVelocity[0] = Math.min(Math.max(this.playerVelocity[0], -this.currentMap!.velocityLimit[0]), this.currentMap!.velocityLimit[0]);
        this.playerVelocity[1] = Math.min(Math.max(this.playerVelocity[1], -this.currentMap!.velocityLimit[1]), this.currentMap!.velocityLimit[1]);
        
        this.playerPosition[0] += this.playerVelocity[0];
        this.playerPosition[1] += this.playerVelocity[1];
        
        this.playerVelocity[0] *= .9;

        // // Manage collision
        // const playerGX = fastRound(this.playerPosition[0] / this.tileSize);
        // const playerGY = fastRound(this.playerPosition[1] / this.tileSize);
        // console.log(this.getMaterialPixelCoords(playerGX, playerGY));


        const offset = fastFloor(this.tileSize / 2);

        const matTop = this.getMaterial(
            fastRound((this.playerPosition[0]) / this.tileSize),
            fastRound((this.playerPosition[1] - offset) / this.tileSize)
        );
        const matRight = this.getMaterial(
            fastRound((this.playerPosition[0] + offset) / this.tileSize),
            fastRound((this.playerPosition[1]) / this.tileSize)
        );
        const matBottom = this.getMaterial(
            fastRound((this.playerPosition[0]) / this.tileSize),
            fastRound((this.playerPosition[1] + offset) / this.tileSize)
        );
        const matLeft = this.getMaterial(
            fastRound((this.playerPosition[0] - offset) / this.tileSize),
            fastRound((this.playerPosition[1]) / this.tileSize)
        );

        if (matTop?.solid) {
            this.playerPosition[1] += 0.1;
        }
        if (matRight?.solid) {
            this.playerPosition[0] -= 0.1;
        }
        if (matBottom?.solid) {
            this.playerPosition[1] -= 0.1;
        }
        if (matLeft?.solid) {
            this.playerPosition[0] += 0.1;
        }
    
        const camX = fastRound(this.playerPosition[0] - this.viewport[0] / 2);
        const camY = fastRound(this.playerPosition[1] - this.viewport[1] / 2);
        const deltaCamX = camX - this.camera[0];
        const deltaCamY = camY - this.camera[1];

        this.camera[0] += deltaCamX;
        this.camera[1] += deltaCamY;
        
        if(this.lastTile?.id !== tile?.id && tile?.script) {
            eval(this.currentMap!.scripts[tile.script]);
        }
        
        this.lastTile = tile;
    }
}
