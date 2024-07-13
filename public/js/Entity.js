import AudioBoard from "./AudioBoard.js";
import BoundingBox from "./BoundingBox.js";
import EventBuffer from "./EventBuffer.js";
import { Vec2 } from "./math.js";

export const Sides = {
  BOTTOM: Symbol("bottom"),
  TOP: Symbol("top"),
  LEFT: Symbol("left"),
  RIGHT: Symbol("right"),
};

export class Trait {
  static EVENT_TASK = Symbol("task");

  constructor(name) {
    /**
     * @type {string}
     */
    this.NAME = name;

    this.listeners = [];
  }

  listen(name, callback, count = Infinity) {
    this.listeners.push({ name, callback, count });
  }

  finalize(entity) {
    this.listeners = this.listeners.filter((listener) => {
      entity.events.process(listener.name, listener.callback);
      return --listener.count;
    });
  }

  queue(task) {
    this.listen(Trait.EVENT_TASK, task, 1);
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

    this.sounds = new Set();

    this.events = new EventBuffer();
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
    this.events.emit(Trait.EVENT_TASK);

    this.traits.forEach((trait) => {
      trait.finalize(this);
    });

    this.events.clear();
  }

  playSounds(audioBoard, audioContext) {
    this.sounds.forEach((name) => {
      audioBoard.playAudio(name, audioContext);
    });

    this.sounds.clear();
  }

  /**
   * @param {number} deltaTime
   */
  update(gameContext, level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
    });

    this.playSounds(this.audio, gameContext.audioContext);

    this.lifeTime += gameContext.deltaTime;
  }
}
