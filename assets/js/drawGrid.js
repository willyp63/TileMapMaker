const Constants = require('./constants');
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
