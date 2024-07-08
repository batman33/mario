import SpriteSheet from "../SpriteSheet.js";
import TileResolver from "../TileResolver.js";

/**
 * @param {Level} level
 * @param {SpriteSheet} sprites
 */
export function createBackgroundLayer(level, tiles, sprites) {
  const resolver = new TileResolver(tiles);

  const buffer = document.createElement("canvas");

  buffer.width = 256 + 16;
  buffer.height = 240;

  const context = buffer.getContext("2d");

  function redraw(startIndex, endIndex) {
    context.clearRect(0, 0, buffer.width, buffer.height);

    for (let x = startIndex; x <= endIndex; ++x) {
      const col = tiles.grid[x];
      if (col) {
        col.forEach((tile, y) => {
          if (sprites.animations.has(tile.name)) {
            sprites.drawAnimation(tile.name, context, x - startIndex, y, level.totalTime);
          } else {
            sprites.drawTile(tile.name, context, x - startIndex, y);
          }
        });
      }
    }
  }

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {Camera} camera
   */
  return function drawBackgroundLayer(context, camera) {
    const drawWidth = resolver.toIndex(camera.size.x);
    const drawFrom = resolver.toIndex(camera.pos.x);
    const drawTo = drawFrom + drawWidth;
    redraw(drawFrom, drawTo);

    context.drawImage(buffer, -camera.pos.x % 16, -camera.pos.y);
  };
}
