import Entity, { Sides, Trait } from "../Entity.js";

export default class PendulumMove extends Trait {
  constructor() {
    super("pendulumMove");

    this.enabled = true;
    this.speed = -30;
  }

  /**
   * @param {Entity} entity
   * @param {"bottom"|"top"|"left"|"right"} side
   */
  obstruct(entity, side) {
    if (side === Sides.LEFT || side === Sides.RIGHT) {
      this.speed = -this.speed;
    }
  }

  /**
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  update(entity, deltaTime) {
    if (this.enabled) {
      entity.vel.x = this.speed;
    }
  }
}
