import Entity from "../Entity.js";
import Level from "../Level.js";
import Trait from "../Trait.js";
import { Vec2 } from "../math.js";

export default class PlayerController extends Trait {
  constructor() {
    super();

    /**
     * @type {Entity?}
     */
    this.player = undefined;

    /**
     * @type {Vec2}
     */
    this.checkPoint = new Vec2(0, 0);
  }

  /**
   * @param {Entity} entity
   */
  setPlayer(entity) {
    this.player = entity;
  }

  /**
   * @param {Entity} entity
   * @param {number} deltaTime
   * @param {Level} level
   */
  update(entity, { deltaTime }, level) {
    if (!level.entities.has(this.player)) {
      this.player.killable.revive();
      this.player.pos.set(this.checkPoint.x, this.checkPoint.y);
      level.entities.add(this.player);
    }
  }
}
