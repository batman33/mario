import Camera from "./Camera.js";
import Entity from "./Entity.js";
import Level from "./Level.js";
import SpriteSheet from "./SpriteSheet.js";
import TileResolver from "./TileResolver.js";

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

/**
 * @param {Set<Entity>} entities
 */
export function createSpriteLayer(entities, width = 64, height = 64) {
  const spriteBuffer = document.createElement("canvas");
  spriteBuffer.width = width;
  spriteBuffer.height = height;
  const spriteBufferContext = spriteBuffer.getContext("2d");

  return function drawSpriteLayer(context, camera) {
    entities.forEach((entity) => {
      spriteBufferContext.clearRect(0, 0, width, height);

      entity.draw(spriteBufferContext);

      context.drawImage(spriteBuffer, entity.pos.x - camera.pos.x, entity.pos.y - camera.pos.y);
    });
  };
}

/**
 * @param {Level} level
 */
export function createCollisionLayer(level) {
  const resolvedTiles = [];

  const tileResolver = level.tileCollider.tiles;
  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  /**
   * @param {CanvasRenderingContext2D} context
   */
  return function drawCollision(context, camera) {
    context.strokeStyle = "blue";
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
      context.stroke();
    });

    context.strokeStyle = "red";
    level.entities.forEach((entity) => {
      context.beginPath();
      context.rect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });

    resolvedTiles.length = 0;
  };
}

/**
 * @param {Camera} cameraToDraw
 * @returns {function}
 */
export function createCameraLayer(cameraToDraw) {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {Camera} fromCamera
   */
  return function drawCameraRect(context, fromCamera) {
    context.strokeStyle = "purple";
    context.beginPath();
    context.rect(
      cameraToDraw.pos.x - fromCamera.pos.x,
      cameraToDraw.pos.y - fromCamera.pos.y,
      cameraToDraw.size.x,
      cameraToDraw.size.y
    );
    context.stroke();
  };
}
