import { Coord2D, IMap, Material } from "./engine.model";
import { fastCeil, fastFloor, fastRound } from "./engine.util";

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

    getMaterial(x: number, y: number) {
        return this.currentMap!.dataMaterial![y]![x]; // TODO: Should I guard this?
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

                if (foreground === tile.foreground) {
                    const tX = (x * this.tileSize) - this.camera[0];
                    const tY = (y * this.tileSize) - this.camera[1];
                    
                    this.drawTile(tX, tY, tile);
                }
            }
        }

        if (!foreground) {
            this.drawMap(0);
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

        for (const matIdx in map.materials) {
            const material = map.materials[matIdx];

            for (let y = 0; y < map.data.length; y++) {
                this.currentMap.height = Math.max(this.currentMap.height, y);

                for (let x = 0; x < map.data[y].length; x++) {
                    this.currentMap.width = Math.max(this.currentMap.width, x);

                    if (map.data[y][x] === (matIdx as any as number)) {
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

    movePlayer() {
        const tX = this.playerPosition[0] + this.playerVelocity[0];
        const tY = this.playerPosition[1] + this.playerVelocity[1];
    
        const offset = fastRound((this.tileSize / 2) - 1);
    
        const tile = this.getMaterial(
            fastRound(this.playerPosition[0] / this.tileSize),
            fastRound(this.playerPosition[1] / this.tileSize)
        );
        
        // Apply gravity
        if(tile.gravity) {
            this.playerVelocity[0] += tile.gravity[0];
            this.playerVelocity[1] += tile.gravity[1];
        } else {
            this.playerVelocity[0] += this.currentMap!.gravity[0];
            this.playerVelocity[1] += this.currentMap!.gravity[1];
        }
        
        // Apply friction
        if (tile.friction) {
            this.playerVelocity[0] *= tile.friction[0];
            this.playerVelocity[0] *= tile.friction[1];
        }
    
        const tXLower = fastFloor(tX / this.tileSize);
        const tXUpper = fastCeil(tX / this.tileSize);
        const tYLower = fastCeil(tY / this.tileSize);
        const tYUpper = fastFloor(tY / this.tileSize);

        const pXLower = fastRound((this.playerPosition[0] - offset) / this.tileSize);
        const pXUpper = fastRound((this.playerPosition[0] + offset) / this.tileSize);
        const pYLower = fastRound((this.playerPosition[1] - offset) / this.tileSize);
        const pYUpper = fastRound((this.playerPosition[1] + offset) / this.tileSize);
    
        const top1 = this.getMaterial(pXLower, tYUpper);
        const top2 = this.getMaterial(pXUpper, tYUpper);
        const bottom1 = this.getMaterial(pXLower, tYLower);
        const bottom2 = this.getMaterial(pXUpper, tYLower);

        const left1 = this.getMaterial(tXLower, pYLower);
        const left2 = this.getMaterial(tXLower, pYUpper);
        const right1 = this.getMaterial(tXUpper, pYLower);
        const right2 = this.getMaterial(tXUpper, pYUpper);
        // TODO: Understand the above and continue from here
    
        if (tile.jump && this.jump_switch > 15) {
    
            this.player.can_jump = true;
            
            this.jump_switch = 0;
            
        } else this.jump_switch++;
        
        this.player.vel.x = Math.min(Math.max(this.player.vel.x, -this.current_map.vel_limit.x), this.current_map.vel_limit.x);
        this.player.vel.y = Math.min(Math.max(this.player.vel.y, -this.current_map.vel_limit.y), this.current_map.vel_limit.y);
        
        this.player.loc.x += this.player.vel.x;
        this.player.loc.y += this.player.vel.y;
        
        this.player.vel.x *= .9;
        
        if (left1.solid || left2.solid || right1.solid || right2.solid) {
    
            /* fix overlap */
    
            while (this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near1).solid
                || this.get_tile(Math.floor(this.player.loc.x / this.tile_size), y_near2).solid)
                this.player.loc.x += 0.1;
    
            while (this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near1).solid
                || this.get_tile(Math.ceil(this.player.loc.x / this.tile_size), y_near2).solid)
                this.player.loc.x -= 0.1;
    
            /* tile bounce */
    
            var bounce = 0;
    
            if (left1.solid && left1.bounce > bounce) bounce = left1.bounce;
            if (left2.solid && left2.bounce > bounce) bounce = left2.bounce;
            if (right1.solid && right1.bounce > bounce) bounce = right1.bounce;
            if (right2.solid && right2.bounce > bounce) bounce = right2.bounce;
    
            this.player.vel.x *= -bounce || 0;
            
        }
        
        if (top1.solid || top2.solid || bottom1.solid || bottom2.solid) {
    
            /* fix overlap */
            
            while (this.get_tile(x_near1, Math.floor(this.player.loc.y / this.tile_size)).solid
                || this.get_tile(x_near2, Math.floor(this.player.loc.y / this.tile_size)).solid)
                this.player.loc.y += 0.1;
    
            while (this.get_tile(x_near1, Math.ceil(this.player.loc.y / this.tile_size)).solid
                || this.get_tile(x_near2, Math.ceil(this.player.loc.y / this.tile_size)).solid)
                this.player.loc.y -= 0.1;
    
            /* tile bounce */
            
            var bounce = 0;
            
            if (top1.solid && top1.bounce > bounce) bounce = top1.bounce;
            if (top2.solid && top2.bounce > bounce) bounce = top2.bounce;
            if (bottom1.solid && bottom1.bounce > bounce) bounce = bottom1.bounce;
            if (bottom2.solid && bottom2.bounce > bounce) bounce = bottom2.bounce;
            
            this.player.vel.y *= -bounce || 0;
    
            if ((bottom1.solid || bottom2.solid) && !tile.jump) {
                
                this.player.on_floor = true;
                this.player.can_jump = true;
            }
            
        }
        
        // adjust camera
    
        var c_x = Math.round(this.player.loc.x - this.viewport.x/2);
        var c_y = Math.round(this.player.loc.y - this.viewport.y/2);
        var x_dif = Math.abs(c_x - this.camera.x);
        var y_dif = Math.abs(c_y - this.camera.y);
        
        if(x_dif > 5) {
            
            var mag = Math.round(Math.max(1, x_dif * 0.1));
        
            if(c_x != this.camera.x) {
                
                this.camera.x += c_x > this.camera.x ? mag : -mag;
                
                if(this.limit_viewport) {
                    
                    this.camera.x = 
                        Math.min(
                            this.current_map.width_p - this.viewport.x + this.tile_size,
                            this.camera.x
                        );
                    
                    this.camera.x = 
                        Math.max(
                            0,
                            this.camera.x
                        );
                }
            }
        }
        
        if(y_dif > 5) {
            
            var mag = Math.round(Math.max(1, y_dif * 0.1));
            
            if(c_y != this.camera.y) {
                
                this.camera.y += c_y > this.camera.y ? mag : -mag;
            
                if(this.limit_viewport) {
                    
                    this.camera.y = 
                        Math.min(
                            this.current_map.height_p - this.viewport.y + this.tile_size,
                            this.camera.y
                        );
                    
                    this.camera.y = 
                        Math.max(
                            0,
                            this.camera.y
                        );
                }
            }
        }
        
        if(this.last_tile != tile.id && tile.script) {
        
            eval(this.current_map.scripts[tile.script]);
        }
        
        this.last_tile = tile.id;
    }
}

/* Setup of the engine */

window.requestAnimFrame =
  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(callback) {
    return window.setTimeout(callback, 1000 / 60);
  };

var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 400;

var game = new Clarity();
    game.set_viewport(canvas.width, canvas.height);
    game.load_map(map);

    /* Limit the viewport to the confines of the map */
    game.limit_viewport = true;

var Loop = function() {
  
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  game.update();
  game.draw(ctx);
  
  window.requestAnimFrame(Loop);
};

Loop();