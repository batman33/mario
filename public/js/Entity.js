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

  /**
   * @param {Entity} us
   * @param {Entity} them
   */
  collides(us, them) {}

  update() {}
}

export default class Entity {
  constructor() {
    /**
     * @type {boolean}
     */
    this.canCollide = true;
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

  collides(candidate) {
    this.traits.forEach((trait) => {
      trait.collides(this, candidate);
    });
  }

  obstruct(side) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side);
    });
  }

  draw() {}

  /**
   * @param {number} deltaTime
   */
  update(deltaTime, level) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime, level);
    });

    this.lifeTime += deltaTime;
  }
}
