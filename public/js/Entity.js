import BoundingBox from "./BoundingBox.js";
import { Vec2 } from "./math.js";

export const Sides = {
  BOTTOM: Symbol("bottom"),
  TOP: Symbol("top"),
  LEFT: Symbol("left"),
  RIGHT: Symbol("right"),
};

export class Trait {
  constructor(name) {
    /**
     * @type {string}
     */
    this.NAME = name;
  }

  /**
   * @param {Entity} entity
   * @param {"bottom"|"top"|"left"|"right"} side
   */
  obstruct(entity, side) {}

  update() {
    console.warn("Unhandled update call in Trait");
  }
}

export default class Entity {
  constructor() {
    /**
     * @type {Vec2}
     */
    this.pos = new Vec2(0, 0);
    /**
     * @type {Vec2}
     */
    this.vel = new Vec2(0, 0);
    /**
     * @type {Vec2}
     */
    this.size = new Vec2(0, 0);
    /**
     * @type {Vec2}
     */
    this.offset = new Vec2(0, 0);
    /**
     * @type {Number}
     */
    this.lifeTime = 0;
    /**
     * @type {BoundingBox}
     */
    this.bounds = new BoundingBox(this.pos, this.size, this.offset);
    /**
     * @type {Trait}
     */
    this.traits = [];
  }

  /**
   * @param {Trait} trait
   */
  addTrait(trait) {
    this.traits.push(trait);
    this[trait.NAME] = trait;
  }

  obstruct(side) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side);
    });
  }

  /**
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });

    this.lifeTime += deltaTime;
  }
}
