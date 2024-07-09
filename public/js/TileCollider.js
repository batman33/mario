import Entity from "./Entity.js";
import TileResolver from "./TileResolver.js";
import { Matrix } from "./math.js";
import { brick } from "./tiles/brick.js";
import { ground } from "./tiles/ground.js";

const handlers = { ground, brick };

export default class TileCollider {
  constructor() {
    /**
     * @type {TileResolver[]}
     */
    this.resolvers = [];
  }

  /**
   * @param {Matrix} tileMatrix
   */
  addGrid(tileMatrix) {
    this.resolvers.push(new TileResolver(tileMatrix));
  }

  /**
   * @param {Entity} entity
   */
  checkX(entity, gameContext, level) {
    let x;
    if (entity.vel.x > 0) {
      x = entity.bounds.right;
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(x, x, entity.bounds.top, entity.bounds.bottom);
      matches.forEach((match) => this.handle(0, { entity, match, resolver, gameContext, level }));
    }
  }

  /**
   * @param {Entity} entity
   */
  checkY(entity, gameContext, level) {
    let y;
    if (entity.vel.y > 0) {
      y = entity.bounds.bottom;
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(entity.bounds.left, entity.bounds.right, y, y);
      matches.forEach((match) => this.handle(1, { entity, match, resolver, gameContext, level }));
    }
  }

  handle(index, params) {
    const handler = handlers[params.match.tile.type];
    if (handler) {
      handler[index](params);
    }
  }
}
