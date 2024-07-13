import Compositor from "./Compositor.js";
import Entity from "./Entity.js";
import EntityCollider from "./EntityCollider.js";
import EventEmitter from "./EventEmitter.js";
import MusicController from "./MusicController.js";
import TileCollider from "./TileCollider.js";

export default class Level {
  constructor() {
    /**
     * @type {number}
     * @public
     */
    this.gravity = 1500;
    /**
     * @type {number}
     * @public
     */
    this.totalTime = 0;
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
    /**
     * @type {Set<Entity>}
     * @public
     */
    this.entities = new Set();
    /**
     * @type {EntityCollider}
     * @public
     */
    this.entityCollider = new EntityCollider(this.entities);
    /**
     * @type {TileCollider}
     * @public
     */
    this.tileCollider = new TileCollider();
    /**
     * @type {MusicController}
     * @public
     */
    this.music = new MusicController();
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    this.totalTime += gameContext.deltaTime;
  }
}
