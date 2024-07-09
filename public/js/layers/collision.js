import Level from "../Level.js";
import Camera from "../Camera.js";

function createEntityLayer(entities) {
  return function drawBoundingBox(context, camera) {
    context.strokeStyle = "red";
    entities.forEach((entity) => {
      context.beginPath();
      context.rect(entity.bounds.left - camera.pos.x, entity.bounds.top - camera.pos.y, entity.size.x, entity.size.y);
      context.stroke();
    });
  };
}

function createTileCandidateLayer(tileResolver) {
  const resolvedTiles = [];

  const tileSize = tileResolver.tileSize;

  const getByIndexOriginal = tileResolver.getByIndex;
  tileResolver.getByIndex = function getByIndexFake(x, y) {
    resolvedTiles.push({ x, y });
    return getByIndexOriginal.call(tileResolver, x, y);
  };

  return function drawTileCandidates(context, camera) {
    context.strokeStyle = "blue";
    resolvedTiles.forEach(({ x, y }) => {
      context.beginPath();
      context.rect(x * tileSize - camera.pos.x, y * tileSize - camera.pos.y, tileSize, tileSize);
      context.stroke();
    });

    resolvedTiles.length = 0;
  };
}

/**
 * @param {Level} level
 */
export function createCollisionLayer(level) {
  const drawTileCandidates = level.tileCollider.resolvers.map(createTileCandidateLayer);
  const drawBoundingBoxes = createEntityLayer(level.entities);

  /**
   * @param {CanvasRenderingContext2D} context
   * @param {Camera} context
   */
  return function drawCollision(context, camera) {
    drawTileCandidates.forEach((draw) => draw(context, camera));
    drawBoundingBoxes(context, camera);
  };
}
