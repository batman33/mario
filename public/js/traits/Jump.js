import Entity, { Sides, Trait } from "../Entity.js";

export default class Jump extends Trait {
  constructor() {
    super("jump");

    /**
     * @type {number}
     */
    this.ready = 0;
    /**
     * @type {number}
     */
    this.duration = 0.3;
    /**
     * @type {number}
     */
    this.engageTime = 0;
    /**
     * @type {number}
     */
    this.requestTime = 0;
    /**
     * @type {number}
     */
    this.gracePeriod = 0.1;
    /**
     * @type {number}
     */
    this.speedBoots = 0.3;
    /**
     * @type {number}
     */
    this.velocity = 200;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    // if (this.ready > 0) {
    //   this.engageTime = this.duration;
    // }
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  /**
   * @param {Entity} entity
   * @param {"bottom"|"top"|"left"|"right"} side
   */
  obstruct(entity, side) {
    if (side === Sides.BOTTOM) {
      this.ready = 1;
    } else if (side === Sides.TOP) {
      this.cancel();
    }
  }

  /**
   * @param {Entity} entity
   * @param {number} deltaTime
   */
  update(entity, deltaTime) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        this.engageTime = this.duration;
        this.requestTime = 0;
      }

      this.requestTime -= deltaTime;
    }

    if (this.engageTime > 0) {
      entity.vel.y = -(
        this.velocity +
        Math.abs(entity.vel.x) * this.speedBoots
      );
      this.engageTime -= deltaTime;
    }

    this.ready--;
  }
}
