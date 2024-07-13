import Compositor from "./Compositor.js";
import EventEmitter from "./EventEmitter.js";

export default class Scene {
  static EVENT_COMPLETE = Symbol("scene complete");

  constructor() {
    /**
     * @type {EventEmitter}
     * @public
     */
    this.events = new EventEmitter();

    /**
     * @type {Compositor}
     * @public
     */
    this.compositor = new Compositor();
  }

  draw(gameContext) {
    this.compositor.draw(gameContext.videoContext);
  }

  update(gameContext) {}

  pause() {}
}
