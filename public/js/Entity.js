import { Vec2 } from "./math.js";

export class Trait {
  constructor(name) {
    /**
     * @type {string}
     */
    this.NAME = name;
  }

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

  /**
   * @param {number} deltaTime
   */
  update(deltaTime) {
    this.traits.forEach((trait) => {
      trait.update(this, deltaTime);
    });
  }
}
