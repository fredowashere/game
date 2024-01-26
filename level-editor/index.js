(function() {

    function MapDataEditor(targetEl) {

        this.worldSize = 1e2;
        this.worldWrap = null;
        this.world = null;
        this.lmb = 1;
        this.rmb = 0;

        init.bind(this)(targetEl);
    }

    window.MapDataEditor = MapDataEditor;

    MapDataEditor.prototype.setLeftButtonMaterial = function(val) {
        this.lmb = val;
    };

    MapDataEditor.prototype.setRightButtonMaterial = function(val) {
        this.rmb = val;
    };

    MapDataEditor.prototype.load = function(mapData) {

        mapData = localStorage.getItem("prova");
        console.log("hey", mapData);

        // Clear editor from previous map
        this.world.innerHTML = "";

        // Load map data into a new element
        const newEl = document.createElement("DIV");
        newEl.innerHTML = mapData;
        const newElMatrix = getMatrix(newEl);

        const newElMatrixSize = Math.max(newElMatrix.length, ...newElMatrix.map(row => row.length));
        const constructionSize = Math.max(this.worldSize, newElMatrixSize);

        for (let i = -1; i < constructionSize; i++) {

            const rowEl = document.createElement("DIV");
            rowEl.classList.add("map-editor__row");

            // Horizontal editor row
            if (i === -1) {
                rowEl.classList.add("map-editor__row--editor");
            }

            for (let j = -1; j < constructionSize; j++) {

                const tileEl = document.createElement("DIV");
                tileEl.classList.add("map-editor__tile");
                tileEl.setAttribute("data-i", i);
                tileEl.setAttribute("data-j", j);
                rowEl.appendChild(tileEl);

                // Transfer data-key to constructed map
                if (newElMatrix[i] && newElMatrix[i][j] && ![ undefined, null ].includes(newElMatrix[i][j].getAttribute("data-key"))) {
                    tileEl.setAttribute("data-key", newElMatrix[i][j].getAttribute("data-key"));
                }

                // Horizontal editor row's tiles
                if (i === -1) {
                    tileEl.classList.add("map-editor__tile--editor");
                    tileEl.appendChild(createNumEl(j));
                }

                // Vertical editor row's tiles
                if (i !== -1 && j === -1) {
                    tileEl.classList.add("map-editor__tile--editor");
                    tileEl.appendChild(createNumEl(i));
                }
            }

            this.world.appendChild(rowEl);
        }
    };

    MapDataEditor.prototype.save = function() {

        // Copy map data into a new element
        const copyOfWrap = this.worldWrap.innerHTML;
        const newEl = document.createElement("DIV");
        newEl.innerHTML = copyOfWrap;

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
        return [...el.querySelectorAll(".map-editor__row")].map(row => row.querySelectorAll(".map-editor__tile"));
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
            return console.error("Missing target element, cannot initialize.");
        }

        this.worldWrap = targetEl;
        this.worldWrap.classList.add("map-editor__world-wrap");
        this.world = this.worldWrap.querySelector(".world");
        if (!this.world) {
            this.world = document.createElement("DIV");
            this.world.classList.add(".map-editor__world");
            this.worldWrap.appendChild(this.world);
        }

        let minZoom = 4;
        let maxZoom = 64;
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
                if (mdevt.target.classList.contains("map-editor__tile") && !mdevt.target.classList.contains("map-editor__tile--editor")) {
                    if (this.lmb === null) {
                        mdevt.target.removeAttribute("data-key");
                    }
                    else {
                        mdevt.target.setAttribute("data-key", this.lmb);
                    }
                }
            }

            if (mdevt.button === 2) {
                if (mdevt.target.classList.contains("map-editor__tile") && !mdevt.target.classList.contains("map-editor__tile--editor")) {
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
                    if (mmevt.target.classList.contains("map-editor__tile") && !mmevt.target.classList.contains("map-editor__tile--editor")) {
                        if (this.lmb === null) {
                            mmevt.target.removeAttribute("data-key");
                        }
                        else {
                            mmevt.target.setAttribute("data-key", this.lmb);
                        }
                    }
                }

                if (mdevt.button === 2) {
                    if (mmevt.target.classList.contains("map-editor__tile") && !mmevt.target.classList.contains("map-editor__tile--editor")) {
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

            const editorTiles = [ ...this.world.querySelectorAll(".map-editor__tile--editor") ];
            
            // Clean crosshair on all tiles
            editorTiles.forEach(tile => tile.classList.remove("map-editor__tile--crosshair"));
            
            const hoveredEl = evt.target;
            if (hoveredEl.classList.contains("map-editor__tile")) {

                const i = hoveredEl.getAttribute("data-i");
                const j = hoveredEl.getAttribute("data-j");

                // Add crosshair where needed
                editorTiles.forEach(tile => {
                    if (tile.getAttribute("data-i") === i || tile.getAttribute("data-j") === j) {
                        tile.classList.add("map-editor__tile--crosshair");
                    }
                });
            }
        });
    }
})();
