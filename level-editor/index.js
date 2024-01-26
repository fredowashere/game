(function() {

    function MapDataEditor(targetEl, materials, viewportWidth, viewportHeight) {
        
        this.uuid = Math.random().toString(36).slice(2, 7);
        this.worldSize = 1e2;
        this.worldWrap = null;
        this.world = null;
        this.lmb = null;
        this.rmb = null;

        this.viewportWidth = viewportWidth || 1024;
        this.viewportHeight = viewportHeight || 576;

        init.bind(this)(targetEl);
        addStyle.bind(this)(materials);
    }

    window.MapDataEditor = MapDataEditor;

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
                .replaceAll("world", `map-editor-${this.uuid}__world`)
                .replaceAll("row", `map-editor-${this.uuid}__row`)
                .replaceAll("tile", `map-editor-${this.uuid}__tile`);
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
    };

    MapDataEditor.prototype.export = function() {

        // Copy map data into a new element
        const copyOfWrap = this.worldWrap.innerHTML;

        // Strip HTML from any map-editor 
        const cleaned = copyOfWrap.replaceAll(/map-editor-.*?__/g, "");

        const newEl = document.createElement("DIV");
        newEl.innerHTML = cleaned;

        // Remove .editor elements
        [...newEl.querySelectorAll('[class$="--editor"]')]
            .forEach(editor => editor.remove());

        // Remove .crosshair class
        [...newEl.querySelectorAll(".tile--crosshair")]
            .forEach(ch => ch.classList.remove("tile--crosshair"));

        localStorage.setItem("prova", newEl.innerHTML.trim());

        return newEl.innerHTML.trim();
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

        const tileQuery = `map-editor-${this.uuid}__tile`;
        const tileEditorQuery = `map-editor-${this.uuid}__tile--editor`;
        const tileCrosshairQuery = `map-editor-${this.uuid}__tile--crosshair`;

        // Remove right mouse button menu
        this.worldWrap.addEventListener("contextmenu", evt => evt.preventDefault());

        this.worldWrap.addEventListener("mousedown", mdevt => {

            mdevt.preventDefault();

            const prevX = this.worldWrap.scrollLeft + mdevt.pageX;
            const prevY = this.worldWrap.scrollTop + mdevt.pageY;

            if (mdevt.button === 0) {
                if (mdevt.target.classList.contains(tileQuery) && !mdevt.target.classList.contains(tileEditorQuery)) {
                    if (this.lmb === null) {
                        mdevt.target.removeAttribute("data-key");
                    }
                    else {
                        mdevt.target.setAttribute("data-key", this.lmb);
                    }
                }
            }

            if (mdevt.button === 2) {
                if (mdevt.target.classList.contains(tileQuery) && !mdevt.target.classList.contains(tileEditorQuery)) {
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
                    if (mmevt.target.classList.contains(tileQuery) && !mmevt.target.classList.contains(tileEditorQuery)) {
                        if (this.lmb === null) {
                            mmevt.target.removeAttribute("data-key");
                        }
                        else {
                            mmevt.target.setAttribute("data-key", this.lmb);
                        }
                    }
                }

                if (mdevt.button === 2) {
                    if (mmevt.target.classList.contains(tileQuery) && !mmevt.target.classList.contains(tileEditorQuery)) {
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

        this.world.addEventListener("mousemove", (evt) => {

            const editorTiles = [ ...this.world.querySelectorAll(tileEditorQuery) ];
            
            // Clean crosshair on all tiles
            editorTiles.forEach(tile => tile.classList.remove(tileCrosshairQuery));
            
            const hoveredEl = evt.target;
            if (hoveredEl.classList.contains(tileQuery)) {

                const i = hoveredEl.getAttribute("data-i");
                const j = hoveredEl.getAttribute("data-j");

                // Add crosshair where needed
                editorTiles.forEach(tile => {
                    if (tile.getAttribute("data-i") === i || tile.getAttribute("data-j") === j) {
                        tile.classList.add(tileCrosshairQuery);
                    }
                });
            }
        });
    }

    function addStyle(materials) {

        if (!materials) {
            throw new Error("Missing materials.");
        }

        const materialStyles = materials
            .map(m => `[data-key="${m.id}"] {
    background-color: ${m.color};
}`)
            .join("\n\n");

        const css = `
*[class^="map-editor-${this.uuid}"]  {
    box-sizing: border-box;
}

.map-editor-${this.uuid}__world-wrap {
    background-color: #444;
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
    position: relative;
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

.map-editor-${this.uuid}__tile--crosshair::before {
    content: "";
    position: absolute;
    inset: 0;
    background-color: #f003;
}

${materialStyles}`;

        const style = document.createElement("STYLE");
        style.id = "map-editor-style-" + this.uuid;
        style.innerHTML = css;
        document.head.appendChild(style);
    }
})();
