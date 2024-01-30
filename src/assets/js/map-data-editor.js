(function() {

    function MapDataEditor(targetEl, viewportWidth, viewportHeight) {
        
        this.uuid = Math.random().toString(36).slice(2, 7);
        this.worldSize = 1e2;
        this.worldWrap = null;
        this.world = null;
        this.lmb = null;
        this.rmb = null;

        this.viewportWidth = viewportWidth || 1024;
        this.viewportHeight = viewportHeight || 576;

        this._mi = 0;
        this._mj = 0;
        this._crosshairInterval = -1;
        this._tileClass = `map-editor-${this.uuid}__tile`;
        this._tileEditorClass = `map-editor-${this.uuid}__tile--editor`;
        this._tileCrosshairClass = `map-editor-${this.uuid}__tile--crosshair`;
        this._editorTiles = [];

        init.bind(this)(targetEl);
        addStyles.bind(this)();
    }

    window.MapDataEditor = MapDataEditor;

    MapDataEditor.prototype.setMaterials = function(materials) {

        if (!materials) {
            throw new Error("Missing materials.");
        }

        const css = materials
            .map(m => `[data-key="${m.id}"] { background-color: ${m.color} }`)
            .join("\n\n");

        const oldStyle = document.head.querySelector(`#map-editor-material-styles-${this.uuid}`);
        if (oldStyle) {
            oldStyle.innerHTML = css;
        }
        else {
            const newStyle = document.createElement("STYLE");
            newStyle.id = "map-editor-material-styles-" + this.uuid;
            newStyle.innerHTML = css;
            document.head.appendChild(newStyle);
        }
    };

    MapDataEditor.prototype.setLMB = function(val) {
        this.lmb = val;
    };

    MapDataEditor.prototype.setRMB = function(val) {
        this.rmb = val;
    };

    MapDataEditor.prototype.import = function(mapData) {

        // Add prefix to mapData classes
        if (mapData) {
            mapData = mapData
                .replaceAll("g-world", `map-editor-${this.uuid}__world`)
                .replaceAll("g-row", `map-editor-${this.uuid}__row`)
                .replaceAll("g-tile", `map-editor-${this.uuid}__tile`);
        }

        // Clear editor from previous map
        this.world.innerHTML = "";

        // Load map data into a new element
        const newEl = document.createElement("DIV");
        newEl.innerHTML = mapData;
        const newElMatrix = getMatrix.bind(this)(newEl);

        const newElMatrixSize = Math.max(newElMatrix.length, ...newElMatrix.map(row => row.length));
        const constructionSize = Math.max(this.worldSize, newElMatrixSize);

        for (let i = -1; i < constructionSize; i++) {

            const rowEl = document.createElement("DIV");
            rowEl.classList.add(`map-editor-${this.uuid}__row`);

            // Horizontal editor row
            if (i === -1) {
                rowEl.classList.add(`map-editor-${this.uuid}__row--editor`);
            }

            for (let j = -1; j < constructionSize; j++) {

                const tileEl = document.createElement("DIV");
                tileEl.classList.add(`map-editor-${this.uuid}__tile`);
                tileEl.setAttribute("data-i", i);
                tileEl.setAttribute("data-j", j);
                rowEl.appendChild(tileEl);

                // Transfer data-key to constructed map
                if (newElMatrix[i] && newElMatrix[i][j] && ![ undefined, null ].includes(newElMatrix[i][j].getAttribute("data-key"))) {
                    tileEl.setAttribute("data-key", newElMatrix[i][j].getAttribute("data-key"));
                }

                // Horizontal editor row's tiles
                if (i === -1) {
                    tileEl.classList.add(`map-editor-${this.uuid}__tile--editor`);
                    tileEl.appendChild(createNumEl(j));
                }

                // Vertical editor row's tiles
                if (i !== -1 && j === -1) {
                    tileEl.classList.add(`map-editor-${this.uuid}__tile--editor`);
                    tileEl.appendChild(createNumEl(i));
                }
            }

            this.world.appendChild(rowEl);
        }

        this._editorTiles = [ ...this.world.querySelectorAll("." + this._tileEditorClass) ];
    };

    MapDataEditor.prototype.export = function() {

        // Copy map data into a new element
        const copyOfWrap = this.worldWrap.innerHTML;

        // Strip editor prefix 
        const cleaned = copyOfWrap.replaceAll(/map-editor-.*?__/g, "g-");

        const newEl = document.createElement("DIV");
        newEl.innerHTML = cleaned;

        // Remove editor elements
        [...newEl.querySelectorAll('[class$="--editor"]')]
            .forEach(editor => editor.remove());

        // Remove crosshair elements
        [...newEl.querySelectorAll('[class$="--crosshair"]')]
            .forEach(editor => editor.remove());

        return newEl.innerHTML.trim();
    };

    MapDataEditor.prototype.destroy = function() {
        clearInterval(this._crosshairInterval);
    };

    MapDataEditor.prototype.clean = function() {
        [ ...this.worldWrap.querySelectorAll(`.map-editor-${this.uuid}__tile`) ]
            .forEach(t => t.removeAttribute("data-key"));
    };

    function getMatrix(el) {
        return [...el.querySelectorAll(`.map-editor-${this.uuid}__row`)].map(row => row.querySelectorAll(`.map-editor-${this.uuid}__tile`));
    }

    function createNumEl(num) {
        const numEl = document.createElement("DIV");
        numEl.innerText = num > -1 ? num : "";
        numEl.style.lineHeight = 1;
        numEl.style.color = "#eee";
        numEl.style.fontSize = "0.66em";
        return numEl;
    }

    function init(targetEl) {

        if (!targetEl) {
            throw new Error("Missing target element.");
        }

        this.worldWrap = targetEl;
        this.worldWrap.classList.add(`map-editor-${this.uuid}__world-wrap`);
        this.world = this.worldWrap.querySelector(`.map-editor-${this.uuid}__world`);
        if (!this.world) {
            this.world = document.createElement("DIV");
            this.world.classList.add(`map-editor-${this.uuid}__world`);
            this.worldWrap.appendChild(this.world);
        }

        let minZoom = 4;
        let maxZoom = 48;
        let zoomSteps = 1;
        let zoom = 16;
        this.worldWrap.addEventListener(
            "wheel",
            evt => {
                evt.preventDefault();
                zoom += (evt.deltaY < 0) ? zoomSteps : -zoomSteps
                zoom = Math.min(Math.max(zoom, minZoom), maxZoom);
                this.worldWrap.style.fontSize = zoom + "px";
            },
            { passive: false }
        );

        // Remove right mouse button menu
        this.worldWrap.addEventListener("contextmenu", evt => evt.preventDefault());

        this.worldWrap.addEventListener("mousedown", mdevt => {

            mdevt.preventDefault();

            const prevX = this.worldWrap.scrollLeft + mdevt.pageX;
            const prevY = this.worldWrap.scrollTop + mdevt.pageY;

            if (mdevt.button === 0) {
                if (mdevt.target.classList.contains(this._tileClass) && !mdevt.target.classList.contains(this._tileEditorClass)) {
                    if (this.lmb === null) {
                        mdevt.target.removeAttribute("data-key");
                    }
                    else {
                        mdevt.target.setAttribute("data-key", this.lmb);
                    }
                }
            }

            if (mdevt.button === 2) {
                if (mdevt.target.classList.contains(this._tileClass) && !mdevt.target.classList.contains(this._tileEditorClass)) {
                    if (this.rmb === null) {
                        mdevt.target.removeAttribute("data-key");
                    }
                    else {
                        mdevt.target.setAttribute("data-key", this.rmb);
                    }
                }
            }

            const mouseMoveHandler = mmevt => {

                if (mdevt.button === 1) {
                    const currX = mmevt.pageX;
                    const currY = mmevt.pageY;
                    const dx = prevX - currX;
                    const dy = prevY - currY;
                    this.worldWrap.scrollTo(dx, dy);
                }

                if (mdevt.button === 0) {
                    if (mmevt.target.classList.contains(this._tileClass) && !mmevt.target.classList.contains(this._tileEditorClass)) {
                        if (this.lmb === null) {
                            mmevt.target.removeAttribute("data-key");
                        }
                        else {
                            mmevt.target.setAttribute("data-key", this.lmb);
                        }
                    }
                }

                if (mdevt.button === 2) {
                    if (mmevt.target.classList.contains(this._tileClass) && !mmevt.target.classList.contains(this._tileEditorClass)) {
                        if (this.rmb === null) {
                            mmevt.target.removeAttribute("data-key");
                        }
                        else {
                            mmevt.target.setAttribute("data-key", this.rmb);
                        }
                    }
                }
            }

            const mouseUpHandler = () => {
                document.removeEventListener("mousemove", mouseMoveHandler);
                document.removeEventListener("mouseup", mouseUpHandler);
            }

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler);
        });

        this.world.addEventListener("mousemove", evt => {
            const hoveredEl = evt.target;
            if (hoveredEl.classList.contains(this._tileClass)) {
                this._mi = hoveredEl.getAttribute("data-i");
                this._mj = hoveredEl.getAttribute("data-j");
            }
        });

        this._crosshairInterval = setInterval(
            () => {

                // Clean crosshair on all tiles
                this._editorTiles.forEach(tile => tile.classList.remove(this._tileCrosshairClass));
                
                // Add crosshair where needed
                this._editorTiles.forEach(tile => {
                    if (tile.getAttribute("data-i") === this._mi || tile.getAttribute("data-j") === this._mj) {
                        tile.classList.add(this._tileCrosshairClass);
                    }
                });
            },
            150
        );
    }

    function addStyles() {

        const css = `*[class^="map-editor-${this.uuid}"]  {
    box-sizing: border-box;
}

.map-editor-${this.uuid}__world-wrap {
    background-image: linear-gradient(45deg, #777, #333);
    position: relative;
    width: ${this.viewportWidth}px;
    height: ${this.viewportHeight}px;
    overflow: auto;
}

.map-editor-${this.uuid}__world {
    position: absolute;
}
    
.map-editor-${this.uuid}__row {
    display: flex;
}

.map-editor-${this.uuid}__row--editor {
    position: sticky;
    top: 0;
    z-index: 1;
    background-color: #444;
}

.map-editor-${this.uuid}__row > .map-editor-${this.uuid}__tile {
    display: grid;
    place-items: center;
}

.map-editor-${this.uuid}__tile {
    border: 1px solid #fff2;
    width: 1em;
    height: 1em;
    flex: 0 0 1em;
}

.map-editor-${this.uuid}__tile--editor {
    position: sticky;
    left: 0;
    z-index: 2;
    background-color: #444;
}

.map-editor-${this.uuid}__tile--crosshair {
    border: 1px solid #f008;
}`;

        const style = document.createElement("STYLE");
        style.id = "map-editor-style-" + this.uuid;
        style.innerHTML = css;
        document.head.appendChild(style);
    }
})();
