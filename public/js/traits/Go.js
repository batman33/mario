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
    this.acceleration = 400;
    /**
     * @type {number}
     */
    this.deceleration = 300;
    /**
     * @type {number}
     */
    this.dragFactor = 1 / 5000;
    /**
     * @type {number}
     */
    this.distance = 0;
    /**
     * @type {number}
     */
    this.heading = 1;
  }

  /**
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  update(entity, { deltaTime }) {
    const absX = Math.abs(entity.vel.x);

    if (this.direction !== 0) {
      entity.vel.x += this.acceleration * deltaTime * this.direction;

      if (entity.jump) {
        if (entity.jump.falling === false) {
          this.heading = this.direction;
        }
      } else {
        this.heading = this.direction;
      }
    } else if (entity.vel.x !== 0) {
      const deceleration = Math.min(absX, this.deceleration * deltaTime);
      entity.vel.x += entity.vel.x > 0 ? -deceleration : deceleration;
    } else {
      this.distance = 0;
    }

    const drag = this.dragFactor * entity.vel.x * absX;
    entity.vel.x -= drag;

    this.distance += absX * deltaTime;
  }
}
