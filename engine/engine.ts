import { Coord2D, IMap, Material } from "./engine.model";

export class Engine {
    tileSize: 8|16|24|32;
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
    lastTile?: Material;
    
    canvas: any;
    context: CanvasRenderingContext2D;
    requestAnimationFrame: (cb: () => void) => void;
    running: number;
    then: number;
    frameCap: number;

    constructor() {
        this.tileSize = 16;
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

        this.canvas = document.createElement("CANVAS") as any;
        this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        this.requestAnimationFrame = window.requestAnimationFrame.bind(window) || ((cb: () => void) => window.setTimeout(cb, 1000 / 60));
        this.running = 0;
        this.then = 0;
        this.frameCap = 1000 / 60;
    }

    setViewport(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.viewport[0] = this.canvas.width;
        this.viewport[1] = this.canvas.height;
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
        const startY = Math.floor(this.camera[1] / this.tileSize);
        const endY = (this.camera[1] + this.viewport[1] + this.tileSize) / this.tileSize;

        for (let y = startY; y < endY; y++) {
            const startX = Math.floor(this.camera[0] / this.tileSize);
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
        const offset = Math.round((this.tileSize / 2) - 1);
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

    getMaterialTop() {
        return this.getMaterial(
            Math.floor((this.playerPosition[0] + (this.tileSize / 2)) / this.tileSize),
            Math.floor(this.playerPosition[1] / this.tileSize)
        );
    }

    getMaterialBottom() {
        return this.getMaterial(
            Math.floor((this.playerPosition[0] + (this.tileSize / 2)) / this.tileSize),
            Math.floor((this.playerPosition[1] + this.tileSize) / this.tileSize)
        );
    }

    getMaterialLeft() {
        return this.getMaterial(
            Math.floor(this.playerPosition[0] / this.tileSize),
            Math.floor((this.playerPosition[1] + (this.tileSize / 2)) / this.tileSize)
        );
    }

    getMaterialRight() {
        return this.getMaterial(
            Math.floor((this.playerPosition[0] + this.tileSize) / this.tileSize),
            Math.floor((this.playerPosition[1] + (this.tileSize / 2)) / this.tileSize)
        );
    }

    movePlayer() {
        const tile = this.getMaterial(
            Math.round(this.playerPosition[0] / this.tileSize),
            Math.round(this.playerPosition[1] / this.tileSize)
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
            this.playerVelocity[1] *= tile.friction[1];
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
    
        // Manage camera
        const camX = Math.round(this.playerPosition[0] - this.viewport[0] / 2);
        const camY = Math.round(this.playerPosition[1] - this.viewport[1] / 2);
        const deltaCamX = camX - this.camera[0];
        const deltaCamY = camY - this.camera[1];

        if (Math.abs(deltaCamX) > 8) {
            this.camera[0] += Math.floor(deltaCamX * 0.1);
            this.camera[0] = Math.max(0, Math.min(this.currentMap!.pxWidth! - this.viewport[0] + this.tileSize, this.camera[0]));
        }

        if (Math.abs(deltaCamY) > 8) {
            this.camera[1] += Math.floor(deltaCamY * 0.1);
            this.camera[1] = Math.max(0, Math.min(this.currentMap!.pxHeight! - this.viewport[1] + this.tileSize, this.camera[1]));
        }

        // Run script
        if(this.lastTile?.id !== tile?.id && tile?.script) {
            eval(this.currentMap!.scripts[tile.script]);
        }
        
        this.lastTile = tile;

        // Manage collision
        const top = this.getMaterialTop()!;
        const bottom = this.getMaterialBottom()!;
        const left = this.getMaterialLeft()!;
        const right = this.getMaterialRight()!;

        if (top.solid) {
            this.playerVelocity[1] *= -top.bounce || 0;
            this.playerPosition[1] = Math.ceil(this.playerPosition[1] / this.tileSize) * this.tileSize;
        }

        if (bottom.solid) {
            this.playerVelocity[1] *= -bottom.bounce || 0;
            this.playerPosition[1] = Math.floor(this.playerPosition[1] / this.tileSize) * this.tileSize;

            if(!tile?.jump) {
                this.canJump = 1;
            }
        }

        if (left.solid) {
            this.playerVelocity[0] *= -left.bounce || 0;
            this.playerPosition[0] = Math.ceil(this.playerPosition[0] / this.tileSize) * this.tileSize;
        }

        if (right.solid) {
            this.playerVelocity[0] *= -right.bounce || 0;
            this.playerPosition[0] = Math.floor(this.playerPosition[0] / this.tileSize) * this.tileSize;
        }
    }

    start() {
        if (this.running === 1) {
            return;
        }
        this.running = 1;

        const loop = () => {
            if (this.running === 0) {
                return;
            }

            const now = Date.now();
            if (now - this.then > this.frameCap) {
                this.context.fillStyle = "#333";
                this.context.fillRect(0, 0, this.viewport[0], this.viewport[1]);
    
                this.drawMap(0);
                this.updatePlayer();
                this.drawPlayer();
                this.movePlayer();
    
                this.then = now;
            }

            this.requestAnimationFrame(loop);
        };
        loop();
    }

    stop() {
        this.running = 0;
    }
}
