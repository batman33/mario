import Compositor from "./Compositor.js";
import Entity from "./Entity.js";
import TileCollider from "./TileCollider.js";

export default class Level {
  constructor() {
    /**
     * @type {number}
     * @public
     */
    this.gravity = 1500;
    /**
     * @type {number}
     * @public
     */
    this.totalTime = 0;
    /**
     * @type {Compositor}
     * @public
     */
    this.compositor = new Compositor();
    /**
     * @type {Set<Entity>}
     * @public
     */
    this.entities = new Set();
    /**
     * @type {TileCollider}
     * @public
     */
    this.tileCollider = null;
  }

  setCollisionGrid(matrix) {
    this.tileCollider = new TileCollider(matrix);
  }

  /**
   * @param {float} deltaTime
   */
  update(deltaTime) {
    this.entities.forEach((entity) => {
      entity.update(deltaTime);

      entity.pos.x += entity.vel.x * deltaTime;
      this.tileCollider.checkX(entity);

      entity.pos.y += entity.vel.y * deltaTime;
      this.tileCollider.checkY(entity);

      entity.vel.y += this.gravity * deltaTime;
    });

    this.totalTime += deltaTime;
  }
}
