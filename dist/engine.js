import { fastFloor, fastRound } from "./engine.util.js";
export class Engine {
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
        window.onkeydown = (e) => this.keydown(e);
        window.onkeyup = (e) => this.keyup(e);
    }
    keydown(e) {
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
    keyup(e) {
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
    getMaterial(gX, gY) {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.currentMap) === null || _a === void 0 ? void 0 : _a.dataMaterial) === null || _b === void 0 ? void 0 : _b[gY]) === null || _c === void 0 ? void 0 : _c[gX];
    }
    drawTile(x, y, tile) {
        this.context.fillStyle = tile.color;
        this.context.fillRect(x, y, this.tileSize, this.tileSize);
    }
    drawPlayer() {
        this.context.fillStyle = this.playerColor;
        this.context.beginPath();
        this.context.arc(this.playerPosition[0] + this.tileSize / 2 - this.camera[0], this.playerPosition[1] + this.tileSize / 2 - this.camera[1], this.tileSize / 2 - 1, 0, Math.PI * 2);
        this.context.fill();
    }
    drawMap(foreground = 0) {
        const startY = fastFloor(this.camera[1] / this.tileSize);
        const endY = (this.camera[1] + this.viewport[1] + this.tileSize) / this.tileSize;
        for (let y = startY; y < endY; y++) {
            const startX = fastFloor(this.camera[0] / this.tileSize);
            const endX = (this.camera[0] + this.viewport[0] + this.tileSize) / this.tileSize;
            for (let x = startX; x < endX; x++) {
                const tile = this.getMaterial(x, y);
                if (foreground === (tile === null || tile === void 0 ? void 0 : tile.foreground)) {
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
        if (this.keyLeft && this.playerVelocity[0] > -this.currentMap.velocityLimit[0]) {
            this.playerVelocity[0] -= this.currentMap.movementSpeed[0];
        }
        if (this.keyRight && this.playerVelocity[0] < this.currentMap.velocityLimit[0]) {
            this.playerVelocity[0] += this.currentMap.movementSpeed[0];
        }
        if (this.keyUp && this.canJump && this.playerVelocity[1] > -this.currentMap.velocityLimit[1]) {
            this.playerVelocity[1] -= this.currentMap.movementSpeed[1];
            this.canJump = 0;
        }
    }
    loadMap(map) {
        this.currentMap = map;
        this.currentMap.background = map.background || "#333";
        this.currentMap.gravity = map.gravity || [0, 0.3];
        this.tileSize = map.tileSize || 16;
        this.currentMap.width = 0;
        this.currentMap.height = 0;
        this.currentMap.dataMaterial = this.currentMap.data;
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
    getMaterialPixelCoords(gX, gY) {
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
        var _a;
        const tile = this.getMaterial(fastRound(this.playerPosition[0] / this.tileSize), fastRound(this.playerPosition[1] / this.tileSize));
        // Apply gravity
        if (tile === null || tile === void 0 ? void 0 : tile.gravity) {
            this.playerVelocity[0] += tile.gravity[0];
            this.playerVelocity[1] += tile.gravity[1];
        }
        else {
            this.playerVelocity[0] += this.currentMap.gravity[0];
            this.playerVelocity[1] += this.currentMap.gravity[1];
        }
        // Apply friction
        if (tile === null || tile === void 0 ? void 0 : tile.friction) {
            this.playerVelocity[0] *= tile.friction[0];
            this.playerVelocity[0] *= tile.friction[1];
        }
        if ((tile === null || tile === void 0 ? void 0 : tile.jump) && this.jumpSwitch > 15) {
            this.canJump = 1;
            this.jumpSwitch = 0;
        }
        else {
            this.jumpSwitch++;
        }
        ;
        // Apply forces
        this.playerVelocity[0] = Math.min(Math.max(this.playerVelocity[0], -this.currentMap.velocityLimit[0]), this.currentMap.velocityLimit[0]);
        this.playerVelocity[1] = Math.min(Math.max(this.playerVelocity[1], -this.currentMap.velocityLimit[1]), this.currentMap.velocityLimit[1]);
        this.playerPosition[0] += this.playerVelocity[0];
        this.playerPosition[1] += this.playerVelocity[1];
        this.playerVelocity[0] *= .9;
        // // Manage collision
        // const playerGX = fastRound(this.playerPosition[0] / this.tileSize);
        // const playerGY = fastRound(this.playerPosition[1] / this.tileSize);
        // console.log(this.getMaterialPixelCoords(playerGX, playerGY));
        const offset = fastFloor(this.tileSize / 2);
        const matTop = this.getMaterial(fastRound((this.playerPosition[0]) / this.tileSize), fastRound((this.playerPosition[1] - offset) / this.tileSize));
        const matRight = this.getMaterial(fastRound((this.playerPosition[0] + offset) / this.tileSize), fastRound((this.playerPosition[1]) / this.tileSize));
        const matBottom = this.getMaterial(fastRound((this.playerPosition[0]) / this.tileSize), fastRound((this.playerPosition[1] + offset) / this.tileSize));
        const matLeft = this.getMaterial(fastRound((this.playerPosition[0] - offset) / this.tileSize), fastRound((this.playerPosition[1]) / this.tileSize));
        if (matTop === null || matTop === void 0 ? void 0 : matTop.solid) {
            this.playerPosition[1] += 17;
        }
        if (matRight === null || matRight === void 0 ? void 0 : matRight.solid) {
            this.playerPosition[0] -= 17;
        }
        if (matBottom === null || matBottom === void 0 ? void 0 : matBottom.solid) {
            this.playerPosition[1] -= 17;
        }
        if (matLeft === null || matLeft === void 0 ? void 0 : matLeft.solid) {
            this.playerPosition[0] += 17;
        }
        const camX = fastRound(this.playerPosition[0] - this.viewport[0] / 2);
        const camY = fastRound(this.playerPosition[1] - this.viewport[1] / 2);
        const deltaCamX = camX - this.camera[0];
        const deltaCamY = camY - this.camera[1];
        this.camera[0] += deltaCamX;
        this.camera[1] += deltaCamY;
        if (((_a = this.lastTile) === null || _a === void 0 ? void 0 : _a.id) !== (tile === null || tile === void 0 ? void 0 : tile.id) && (tile === null || tile === void 0 ? void 0 : tile.script)) {
            eval(this.currentMap.scripts[tile.script]);
        }
        this.lastTile = tile;
    }
}
