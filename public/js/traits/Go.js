import Entity, { Trait } from "../Entity.js";

export default class Go extends Trait {
  constructor() {
    super("go");
    /**
     * @type {number}
     */
    this.direction = 0;
    /**
     * @type {number}
     */
    this.speed = 5000;
    /**
     * @type {number}
     */
    this.distance = 0;
    /**
     * @type {number}
     */
    this.heading = 0;
  }

  /**
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  update(entity, deltaTime) {
    entity.vel.x = this.speed * this.direction * deltaTime;

    if (this.direction) {
      this.distance += Math.abs(entity.vel.x * deltaTime);
      this.heading = this.direction;
    } else {
      this.distance = 0;
    }
  }
}
