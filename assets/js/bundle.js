/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const TileSet = __webpack_require__(1);
	const TileMap = __webpack_require__(9);
	
	function documentReady () {
	  const tileSet = new TileSet($('.tile-set')[0], '/imgs/tile-set0.png');
	  const tileMap = new TileMap($('.tile-map')[0], 10, 10, tileSet);
	
	  $(tileMap.canvas).mouseup(function (e) {
	
	  });
	}
	
	$(documentReady);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(2);
	const CANVAS_TILE_SIZE = Constants.TILE_SIZE * Constants.CANVAS_SCALE;
	const debounce = __webpack_require__(4);
	const drawGrid = __webpack_require__(8);
	
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = {
	  TILE_SIZE: 16,
	  CANVAS_SCALE: 2
	};


/***/ },
/* 3 */,
/* 4 */
/***/ function(module, exports) {

	function debounce (fn, waitTime) {
	  let waiting = false;
	  let mostRecentArgs;
	  const makeCall = function (arguements) {
	    fn(...arguements);
	    waiting = true;
	    mostRecentArgs = null;
	
	    setTimeout(function () {
	      if (mostRecentArgs) {
	        makeCall(mostRecentArgs);
	      } else {
	        waiting = false;
	      }
	    }, waitTime);
	  };
	
	  return function (...args) {
	    if (waiting) {
	      mostRecentArgs = args.slice();
	    } else {
	      makeCall(args);
	    }
	  };
	}
	
	module.exports = debounce;


/***/ },
/* 5 */,
/* 6 */,
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(2);
	const CANVAS_TILE_SIZE = Constants.TILE_SIZE * Constants.CANVAS_SCALE;
	
	function drawGrid (canvas, numCols, numRows) {
	  // check element type
	  if (canvas.tagName !== 'CANVAS') {
	    throw new Error('must be canvas element');
	  }
	
	  // draw grid
	  const ctx = canvas.getContext('2d');
	  ctx.strokeStyle = '#000';
	  ctx.lineWidth = 2.0;
	
	  for (let i = 1; i < numCols; i++) {
	    ctx.beginPath();
	    ctx.moveTo(i * CANVAS_TILE_SIZE, 0);
	    ctx.lineTo(i * CANVAS_TILE_SIZE, CANVAS_TILE_SIZE * numRows);
	    ctx.stroke();
	  }
	  for (let i = 1; i < numRows; i++) {
	    ctx.beginPath();
	    ctx.moveTo(0, i * CANVAS_TILE_SIZE);
	    ctx.lineTo(CANVAS_TILE_SIZE * numCols, i * CANVAS_TILE_SIZE);
	    ctx.stroke();
	  }
	};
	
	module.exports = drawGrid;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const Constants = __webpack_require__(2);
	const CANVAS_TILE_SIZE = Constants.TILE_SIZE * Constants.CANVAS_SCALE;
	const drawGrid = __webpack_require__(8);
	
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


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map