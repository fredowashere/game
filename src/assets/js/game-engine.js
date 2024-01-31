(function () {

    /* Clarity engine */
    function Clarity(domTarget) {

        if (!domTarget) return this.error("Cannot initialize engine without a valid target element.");

        this.domTarget = domTarget;
        this.domWorldWrap = null;
        this.domWorld = null;
        this.domPlayer = null;

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

        if (this.domWorldWrap) {
            this.domWorldWrap.style.width = x + "px";
            this.domWorldWrap.style.height = y + "px";
        }
    };

    Clarity.prototype.keydown = function (e) {

        e.preventDefault();

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

        e.preventDefault();

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

    Clarity.prototype.cleanHtml = function() {
        if (this.domWorldWrap || this.domWorld || this.domPlayer) {
            this.domTarget.innerHTML = "";
        }
    };

    Clarity.prototype.createHtml = function() {

        this.cleanHtml();

        this.domPlayer = document.createElement("DIV");
        this.domPlayer.classList.add("g-player");
        this.domPlayer.style.position = "absolute";
        this.domPlayer.style.transform = "translate(-50%, -50%)";
        this.domPlayer.style.borderRadius = "50%";
        this.domPlayer.style.width = this.currentMap.tileSize + "px";
        this.domPlayer.style.height = this.currentMap.tileSize + "px";

        this.domWorld = document.createElement("DIV");
        this.domWorld.classList.add("g-world");
        this.domWorld.style.position = "relative";
        this.domWorld.innerHTML = this.currentMap.data;

        this.domWorld.querySelectorAll(".g-row").forEach(row => row.style.display = "flex");

        this.currentMap.dom = [ ...this.domWorld.querySelectorAll(".g-row") ].map(row => [ ...row.querySelectorAll(".g-tile") ]);
        
        this.domWorldWrap = document.createElement("DIV");
        this.domWorldWrap.classList.add("g-world-wrap");
        this.domWorldWrap.style.backgroundColor = "#333";
        this.domWorldWrap.style.overflow = "hidden";
        this.domWorldWrap.style.width = this.viewport.x + "px";
        this.domWorldWrap.style.height = this.viewport.y + "px";

        this.domWorld.appendChild(this.domPlayer);
        this.domWorldWrap.appendChild(this.domWorld);
        this.domTarget.appendChild(this.domWorldWrap);
    };

    Clarity.prototype.loadMap = function (map) {

        if (
            typeof map      === "undefined"
         || typeof map.data === "undefined"
         || typeof map.keys === "undefined"
        ) {
            this.error("Error: Invalid map data!");
            return false;
        }

        this.currentMap = map;
        this.createHtml();

        this.currentMap.background = map.background || "#333";
        this.currentMap.gravity = map.gravity || { x: 0, y: 0.3 };
        this.tileSize = map.tileSize || 16;

        this.currentMap.height = this.currentMap.dom.length;
        this.currentMap.width = Math.max(...this.currentMap.dom.map(row => row.length));

        Object.values(map.keys).forEach(key => {
            this.currentMap.dom.forEach((row, y) => {
                row.forEach((tile, x) => {
                    const tileKey = tile.getAttribute("data-key");
                    if (tileKey == key.id) {
                        const domTile = this.currentMap.dom[y][x];
                        domTile.style.width = this.tileSize + "px";
                        domTile.style.height = this.tileSize + "px";
                        domTile.style.flex = "0 0 " + this.tileSize + "px";
                        domTile.style.backgroundColor = key.color;
                        domTile._key = key;
                    }
                });
            });
        });
        
        this.currentMap.widthP = this.currentMap.width * this.tileSize;
        this.currentMap.heightP = this.currentMap.height * this.tileSize;

        this.player.loc.x = map.player.x * this.tileSize || 0;
        this.player.loc.y = map.player.y * this.tileSize || 0;
        this.player.color = map.player.color || "#000";
    
        this.key.left  = false;
        this.key.up    = false;
        this.key.right = false;
        
        this.camera = { x: 0, y: 0 };
        
        this.player.vel = { x: 0, y: 0 };

        this.log("Successfully loaded map data.");

        return true;
    };

    Clarity.prototype.getTile = function (x, y) {
        return this.currentMap.dom[y] && this.currentMap.dom[y][x] ? this.currentMap.dom[y][x] : { _key: 0 };
    };

    Clarity.prototype.drawTile = function (tile) {
        if (!tile || !tile._key || !tile._key.color) return;
        tile.style.backgroundColor = tile._key.color;
    };

    Clarity.prototype.drawMap = function () {

        let y = (this.camera.y / this.tileSize) | 0;
        const height = (this.camera.y + this.viewport.y + this.tileSize) / this.tileSize;

        for (; y < height; y++) {

            let x = (this.camera.x / this.tileSize) | 0;
            const width = (this.camera.x + this.viewport.x + this.tileSize) / this.tileSize;

            for (; x < width; x++) {
                this.drawTile(this.getTile(x, y));
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
        
        if (tile._key.gravity) {
            this.player.vel.x += tile._key.gravity.x;
            this.player.vel.y += tile._key.gravity.y;
        }
        else {
            this.player.vel.x += this.currentMap.gravity.x;
            this.player.vel.y += this.currentMap.gravity.y;
        }
        
        if (tile._key.friction) {
            this.player.vel.x *= tile._key.friction.x;
            this.player.vel.y *= tile._key.friction.y;
        }

        const tYUp   = Math.floor(tY / this.tileSize);
        const tYDown = Math.ceil(tY / this.tileSize);
        const yNear1 = Math.round((this.player.loc.y - offset) / this.tileSize);
        const yNear2 = Math.round((this.player.loc.y + offset) / this.tileSize);

        const tXLeft  = Math.floor(tX / this.tileSize);
        const tXRight = Math.ceil(tX / this.tileSize);
        const xNear1  = Math.round((this.player.loc.x - offset) / this.tileSize);
        const xNear2  = Math.round((this.player.loc.x + offset) / this.tileSize);

        const top1    = this.getTile(xNear1, tYUp)._key;
        const top2    = this.getTile(xNear2, tYUp)._key;
        const bottom1 = this.getTile(xNear1, tYDown)._key;
        const bottom2 = this.getTile(xNear2, tYDown)._key;
        const left1   = this.getTile(tXLeft, yNear1)._key;
        const left2   = this.getTile(tXLeft, yNear2)._key;
        const right1  = this.getTile(tXRight, yNear1)._key;
        const right2  = this.getTile(tXRight, yNear2)._key;

        if (tile._key.jump && this.jumpSwitch > 15) {
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
                this.getTile(Math.floor(this.player.loc.x / this.tileSize), yNear1)._key.solid
             || this.getTile(Math.floor(this.player.loc.x / this.tileSize), yNear2)._key.solid
            ) {
                this.player.loc.x += 0.1;
            }

            while (
                this.getTile(Math.ceil(this.player.loc.x / this.tileSize), yNear1)._key.solid
             || this.getTile(Math.ceil(this.player.loc.x / this.tileSize), yNear2)._key.solid
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
                this.getTile(xNear1, Math.floor(this.player.loc.y / this.tileSize))._key.solid
            || this.getTile(xNear2, Math.floor(this.player.loc.y / this.tileSize))._key.solid
            ) {
                this.player.loc.y += 0.1;
            }

            while (
                this.getTile(xNear1, Math.ceil(this.player.loc.y / this.tileSize))._key.solid
            || this.getTile(xNear2, Math.ceil(this.player.loc.y / this.tileSize))._key.solid
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

            if ((bottom1.solid || bottom2.solid) && !tile._key.jump) {
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

        this.domWorldWrap.scrollTo(this.camera.x | 0, this.camera.y | 0)
        
        if (this.lastTile != tile._key.id && tile._key.script) {
            eval(tile._key.script);
        }
        
        this.lastTile = tile._key.id;
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
        this.domPlayer.style.backgroundColor = this.player.color;
        this.domPlayer.style.left = (this.player.loc.x + this.tileSize / 2) + "px";
        this.domPlayer.style.top = (this.player.loc.y + this.tileSize / 2) + "px";
    };

    function getUUID() {
        return Math.random().toString(36).slice(2, 7);
    }

    window.initGameEngine = function (domTarget, viewportWidth, viewportHeight, level) {

        window.requestAnimFrame = window.requestAnimationFrame || (callback => window.setTimeout(callback, 1000 / 60));

        window.game = new Clarity(domTarget);
               game.setViewport(viewportWidth, viewportHeight);
               game.loadMap(level);
               game.limitViewport = true;
    };

    window.startGameEngine = function () {

        const loop = uuid => {

            game.updatePlayer();
            game.drawMap();
            game.drawPlayer();
            
            if (isGameEngineRunning === uuid) {
                requestAnimFrame(() => loop(uuid));
            }
        };

        window.isGameEngineRunning = getUUID();
        loop(isGameEngineRunning);
    };

    window.stopGameEngine = function () {
        isGameEngineRunning = false;
    };

})();