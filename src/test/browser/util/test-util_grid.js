const { Grid, GridUtil } = require("../../../main/scripts/utils/util_grid");
const {assert, expect} = require('chai');

function deleteChild(element) {
    let child = element.lastElementChild;
    while (child) {
        deleteChild(child);
        console.log("removing child: ", child.id, "from", element.id);
        element.removeChild(child);
        child = element.lastElementChild;
    }
}


const GRID_ID = "grid-container";
const root = document.querySelector("#" + GRID_ID);
let cs = getComputedStyle(root);
const width = MatrixUtil.stripPx(cs.width);
const height = MatrixUtil.stripPx(cs.height);
const MAX_ROWS = 6;
const MAX_COLS = 5;
const grid = new Grid(root, 6, 5, width, height);

describe.only('Setup Grid', function () {
    // deleteChild(root);
    it('create a node', (done) => {
        let node = grid.createNode("title-bar", 0, 0, 1, MAX_COLS, 30);

        node.element.style.border = "1px solid magenta";
        assert.equal(30 + "px", node.element.style.height);
        assert.equal(30, node.height);

        // const cs = getComputedStyle(root);
        // assert.equal(MatrixUtil.stripPx(cs.width), node.width);
        // assert.equal(cs.width, node.element.style.width);

        done();
    });

    it('create another node', (done) => {
        let node = grid.createNode("menu-bar", 1, 0,1, MAX_COLS, 120);

        node.element.style.border = "1px solid blue";
        // assert.equal(120 + "px", node.element.style.height);
        // assert.equal(120, node.height);

        // const cs = getComputedStyle(root);
        // assert.equal(MatrixUtil.stripPx(cs.width), node.width);
        // assert.equal(cs.width, node.element.style.width);

        done();
    });

    it('create resizable node', (done) => {
        let toolBar = grid.createNode("tool-bar",2,0,1,1,-1,30);

        const cs = getComputedStyle(root);
        // assert.equal(MatrixUtil.stripPx(cs.height) - 30 - 120, toolBar.height);
        // assert.equal(cs.height, toolBar.element.style.width);

        let toolBarContent = grid.createNode("tool-bar-content", 2, 1, 1, 1);
        let mainContent = grid.createNode("main-content", 2, 2,1, 1);
        let rightTabContent = grid.createNode("right-tab-content", 2, 3, 1, 1);
        let rightTab = grid.createNode("right-tab", 2, 4,1, 1, -1, 30);
        let bottomTabContent = grid.createNode("bottom-tab-content", 3, 0,1, MAX_COLS);
        let bottomTab = grid.createNode("bottom-tab", 4, 0,1, MAX_COLS,30);
        let statusBar = grid.createNode("status-bar", 5, 0,1, MAX_COLS,20);

        // toolBar.element.style.border = "1px solid red";
        // toolBarContent.element.style.border = "1px solid green";
        // mainContent.element.style.border = "1px solid yellow";
        // rightTabContent.element.style.border = "1px solid white";
        // rightTab.element.style.border = "1px solid purple";
        // bottomTabContent.element.style.border = "1px solid orange";
        // bottomTab.element.style.border = "1px solid brown";
        // statusBar.element.style.border = "1px solid turquoise";

        const tBC = new Resize(toolBarContent, RIGHT, 2);
        const rTC = new Resize(rightTabContent, LEFT, 2);
        const bTC = new Resize(bottomTabContent, TOP, 2);
        // assert.equal(120 + "px", node.element.style.height);
        bottomTabContent.updateSize(-300, false, true, TOP);
        toolBarContent.updateSize(-300, true, true, RIGHT);
        rightTabContent.updateSize(-300, true, true, LEFT);
        done();
    });
});