const Constants = require('./constants');
const CANVAS_TILE_SIZE = Constants.TILE_SIZE * Constants.CANVAS_SCALE;
const debounce = require('./debounce');
const drawGrid = require('./drawGrid');

class TileSet {
  constructor (canvas, imgSrc) {
    this.canvas = canvas;

    // load image
    this.image = new Image();
    this.image.crossOrigin = "anonymous";
    this.image.src = imgSrc;
    this.image.onload = this.onImageLoad.bind(this);
  }
  onImageLoad () {
    // set width/height
    this.canvas.width = this.image.width * Constants.CANVAS_SCALE;
    this.canvas.height = this.image.height * Constants.CANVAS_SCALE;

    // draw tile image to scale
    const ctx = this.canvas.getContext('2d');
    ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

    // draw grid
    this.numCols = Math.floor(this.image.width / Constants.TILE_SIZE);
    this.numRows = Math.floor(this.image.height / Constants.TILE_SIZE);
    drawGrid(this.canvas, this.numCols, this.numRows);

    // listen for clicks
    $(this.canvas).mousedown(this.tileClicked.bind(this));
  }
  tileClicked (e) {
    // create a new canvas element for clicked tile
    const clickX = e.pageX - $(this.canvas).offset().left;
    const clickY = e.pageY - $(this.canvas).offset().top;
    const col = Math.floor(clickX / CANVAS_TILE_SIZE);
    const row = Math.floor(clickY / CANVAS_TILE_SIZE);
    this.dragableTile = this.tileAt(col, row);
    this.tileIndex = (row * this.numCols) + col;

    $('body').append(this.dragableTile);
    this.snapTileToMouse(e);
    $(document).mousemove(debounce(this.tileDragged.bind(this), 75));
    $(document).mouseup(this.tileDropped.bind(this));
  }
  snapTileToMouse (e) {
    $(this.dragableTile).css('top', `${e.pageY - CANVAS_TILE_SIZE / 2}px`);
    $(this.dragableTile).css('left', `${e.pageX - CANVAS_TILE_SIZE / 2}px`);
  }
  tileDragged (e) {
    this.snapTileToMouse(e);
  }
  tileDropped (e) {
    // $(document).off('mousemove mouseup');
    $('.dragable-tile').remove();
  }
  tileAt (col, row) {
    const ctx = this.canvas.getContext('2d');

    // extract tile image
    const imageData = ctx.getImageData(col * CANVAS_TILE_SIZE, row * CANVAS_TILE_SIZE,
                              CANVAS_TILE_SIZE, CANVAS_TILE_SIZE);

    // create tile element
    const tile = document.createElement('canvas');
    tile.width = CANVAS_TILE_SIZE;
    tile.height = CANVAS_TILE_SIZE;
    tile.classList.add('dragable-tile');

    // draw tile image
    const tileCtx = tile.getContext('2d');
    tileCtx.putImageData(imageData, 0, 0);

    return tile;
  }
}

module.exports = TileSet;
