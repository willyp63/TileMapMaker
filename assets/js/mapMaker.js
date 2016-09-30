const TileSet = require('./tileSet');
const TileMap = require('./tileMap');

function documentReady () {
  const tileSet = new TileSet($('.tile-set')[0], '/imgs/tile-set0.png');
  const tileMap = new TileMap($('.tile-map')[0], 10, 10, tileSet);

  $(tileMap.canvas).mouseup(function (e) {

  });
}

$(documentReady);
