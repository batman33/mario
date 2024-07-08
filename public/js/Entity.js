import AudioBoard from "./AudioBoard.js";
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
    /**
     * @type {[]}
     */
    this.tasks = [];

    this.sounds = new Set();
  }

  finalize() {
    this.tasks.forEach((task) => task());
    this.tasks.length = 0;
  }

  queue(task) {
    this.tasks.push(task);
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

  playSounds(audioBoard, audioContext) {
    this.sounds.forEach((name) => {
      audioBoard.playAudio(name, audioContext);
    });

    this.sounds.clear();
  }

  update() {}
}

export default class Entity {
  constructor() {
    /**
     * @type {AudioBoard}
     */
    this.audio = new AudioBoard();
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

  obstruct(side, match) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);
    });
  }

  draw() {}

  finalize() {
    this.traits.forEach((trait) => {
      trait.finalize();
    });
  }

  /**
   * @param {number} deltaTime
   */
  update(gameContext, level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
      trait.playSounds(this.audio, gameContext.audioContext);
    });
    this.lifeTime += gameContext.deltaTime;
  }
}
