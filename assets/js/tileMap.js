const Constants = require('./constants');
const CANVAS_TILE_SIZE = Constants.TILE_SIZE * Constants.CANVAS_SCALE;
const drawGrid = require('./drawGrid');

class TileMap {
  constructor (canvas, numRows, numCols, tileSet) {
    this.canvas = canvas;
    this.tileSet = tileSet;
    this.numCols = numCols;
    this.numRows = numRows;

    // map store
    this.mapStore = {numCols: this.numCols, numRows: this.numRows, mapData: []};
    for (var i = 0; i < this.numRows; i++) {
      const row = [];
      for (var j = 0; j < this.numCols; j++) {
        row.push(-1);
      }
      this.mapStore.mapData.push(row);
    }
    $('#map-store').text(JSON.stringify(this.mapStore));

    // set width/height
    this.canvas.width = numCols * CANVAS_TILE_SIZE;
    this.canvas.height = numRows * CANVAS_TILE_SIZE;

    // draw grid
    drawGrid(this.canvas, this.numCols, this.numRows);

    $(document).mouseup(this.droppedTile.bind(this));
  }
  droppedTile (e) {
    // get tile being dragged
    const tile = this.tileSet.dragableTile;
    if (!tile) { return; }

    // get mouse location
    const mouseX = e.pageX - $(this.canvas).offset().left;
    const mouseY = e.pageY - $(this.canvas).offset().top;

    // check that mouse is over map
    if (mouseX < 0 || mouseX >= this.canvas.width ||
          mouseY < 0 || mouseY >= this.canvas.height) { return; }

    // add tile to canvas
    const col = Math.floor(mouseX / CANVAS_TILE_SIZE);
    const row = Math.floor(mouseY / CANVAS_TILE_SIZE);
    this.drawTileAt(tile, col, row);

    // add tile to store
    this.mapStore.mapData[row][col] = this.tileSet.tileIndex;
    $('#map-store').text(JSON.stringify(this.mapStore));

    this.tileSet.dragableTile = null;
    this.tileSet.tileIndex = -1;
  }
  drawTileAt (tile, col, row) {
    // extract tile image
    const tileCtx = tile.getContext('2d');
    const imageData = tileCtx.getImageData(0, 0, CANVAS_TILE_SIZE, CANVAS_TILE_SIZE);

    // draw image
    const ctx = this.canvas.getContext('2d');
    ctx.putImageData(imageData, col * CANVAS_TILE_SIZE, row * CANVAS_TILE_SIZE);

    // draw grid
    drawGrid(this.canvas, this.numCols, this.numRows);
  }
}

module.exports = TileMap;
