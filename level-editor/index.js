const worldSize = 1e2;

const worldWrap = document.querySelector(".world-wrap");
const world = document.querySelector(".world");

let minZoom = 4;
let maxZoom = 64;
let zoomSteps = 1;
let zoom = 16;
document.addEventListener(
    "wheel",
    evt => {
        evt.preventDefault();
        zoom += (evt.deltaY < 0) ? zoomSteps : -zoomSteps
        zoom = Math.min(Math.max(zoom, minZoom), maxZoom);
        worldWrap.style.fontSize = zoom + "px";
    },
    { passive: false }
);

// Remove right mouse button menu
document.addEventListener("contextmenu", evt =>
    evt.preventDefault()
);

const leftMouseButtonMaterial = 1;
const rightMouseButtonMaterial = 0;
worldWrap.addEventListener("mousedown", mdevt => {

    mdevt.preventDefault();

    const prevX = worldWrap.scrollLeft + mdevt.pageX;
    const prevY = worldWrap.scrollTop + mdevt.pageY;

    if (mdevt.button === 0) {
        if (mdevt.target.classList.contains("tile")) {
            if (leftMouseButtonMaterial === null) {
                mdevt.target.removeAttribute("data-key");
            }
            else {
                mdevt.target.setAttribute("data-key", leftMouseButtonMaterial);
            }
        }
    }

    if (mdevt.button === 2) {
        if (mdevt.target.classList.contains("tile")) {
            if (rightMouseButtonMaterial === null) {
                mdevt.target.removeAttribute("data-key");
            }
            else {
                mdevt.target.setAttribute("data-key", rightMouseButtonMaterial);
            }
        }
    }

    function mouseMoveHandler(mmevt) {

        if (mdevt.button === 1) {
            const currX = mmevt.pageX;
            const currY = mmevt.pageY;
            const dx = prevX - currX;
            const dy = prevY - currY;
            worldWrap.scrollTo(dx, dy);
        }

        if (mdevt.button === 0) {
            if (mmevt.target.classList.contains("tile")) {
                mmevt.target.setAttribute("data-key", 1);
            }
        }

        if (mdevt.button === 2) {
            if (mmevt.target.classList.contains("tile")) {
                mmevt.target.removeAttribute("data-key");
            }
        }
    }

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", () =>
        document.removeEventListener("mousemove", mouseMoveHandler)
    );
});

world.addEventListener("mousemove", (evt) => {

    const editorTiles = [ ...world.querySelectorAll(".tile.editor") ];
    
    // Clean crosshair on all tiles
    editorTiles.forEach(tile => tile.classList.remove("crosshair"));
    
    const hoveredEl = evt.target;
    if (hoveredEl.classList.contains("tile")) {

        const i = hoveredEl.getAttribute("data-i");
        const j = hoveredEl.getAttribute("data-j");

        // Add crosshair where needed
        editorTiles.forEach(tile => {
            if (tile.getAttribute("data-i") === i || tile.getAttribute("data-j") === j) {
                tile.classList.add("crosshair");
            }
        });
    }
});

function getMatrix(el) {
    return [...el.querySelectorAll(".row")].map(row => row.querySelectorAll(".tile"));
}

function saveMapData(name, mapDataInnerHTML) {
    localStorage.setItem(name, mapDataInnerHTML);
}

function save() {

    const name = prompt("Choose a name for the map to save.");
    if (!name) return;

    // Copy map data into a new element
    const copyOfWrap = worldWrap.innerHTML;
    const newEl = document.createElement("DIV");
    newEl.innerHTML = copyOfWrap;

    // Remove .editor elements
    [...newEl.querySelectorAll(".editor")]
        .forEach(editor => editor.remove());

    // Remove .crosshair class
    [...newEl.querySelectorAll(".crosshair")]
        .forEach(ch => ch.classList.remove("crosshair"));

    saveMapData(name, newEl.innerHTML.trim());
}

function createNumEl(num) {
    const numEl = document.createElement("DIV");
    numEl.innerText = num > -1 ? num : "";
    numEl.style.lineHeight = 1;
    numEl.style.color = "#eee";
    numEl.style.fontSize = "0.66em";
    return numEl;
}

function loadMapData(mapDataInnerHTML) {

    // Clear editor from previous map
    world.innerHTML = "";

    // Load map data into a new element
    const newEl = document.createElement("DIV");
    newEl.innerHTML = mapDataInnerHTML;
    const newElMatrix = getMatrix(newEl);

    const newElMatrixSize = Math.max(newElMatrix.length, ...newElMatrix.map(row => row.length));
    const constructionSize = Math.max(worldSize, newElMatrixSize);

    for (let i = -1; i < constructionSize; i++) {

        const rowEl = document.createElement("DIV");
        rowEl.classList.add("row");

        // Horizontal editor row
        if (i === -1) {
            rowEl.classList.add("editor");
            rowEl.style.position = "sticky";
            rowEl.style.top = "0";
            rowEl.style.zIndex = "1";
            rowEl.style.backgroundColor = "#444";
        }

        for (let j = -1; j < constructionSize; j++) {

            const tileEl = document.createElement("DIV");
            tileEl.classList.add("tile");
            tileEl.setAttribute("data-i", i);
            tileEl.setAttribute("data-j", j);
            rowEl.appendChild(tileEl);

            // Transfer data-key to constructed map
            if (newElMatrix[i] && newElMatrix[i][j] && ![ undefined, null ].includes(newElMatrix[i][j].getAttribute("data-key"))) {
                tileEl.setAttribute("data-key", newElMatrix[i][j].getAttribute("data-key"));
            }

            // Horizontal editor row's tiles
            if (i === -1) {
                tileEl.classList.add("editor");
                tileEl.style.display = "grid";
                tileEl.style.placeItems = "center";
                tileEl.appendChild(createNumEl(j));
            }

            // Vertical editor row's tiles
            if (i !== -1 && j === -1) {
                tileEl.classList.add("editor");
                tileEl.style.display = "grid";
                tileEl.style.placeItems = "center";
                tileEl.style.position = "sticky";
                tileEl.style.left = "0";
                tileEl.style.zIndex = "1";
                tileEl.style.backgroundColor = "#444";
                tileEl.appendChild(createNumEl(i));
            }
        }

        world.appendChild(rowEl);
    }
}

function load() {
    const name = prompt("Insert the name of the map to load.");
    if (!name) return;
    loadMapData(localStorage.getItem(name));
}

loadMapData();
