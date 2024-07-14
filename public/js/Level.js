import Camera from "./Camera.js";
import Compositor from "./Compositor.js";
import Entity from "./Entity.js";
import EntityCollider from "./EntityCollider.js";
import EventEmitter from "./EventEmitter.js";
import MusicController from "./MusicController.js";
import Scene from "./Scene.js";
import TileCollider from "./TileCollider.js";
import { findPlayers } from "./player.js";

function focusPlayer(level) {
  for (const player of findPlayers(level.entities)) {
    level.camera.pos.x = Math.max(0, player.pos.x - 100);
  }
}

export default class Level extends Scene {
  static EVENT_TRIGGER = Symbol("trigger");

  constructor() {
    super();

    /**
     * @type {string}
     * @public
     */
    this.name = "";
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
     * @type {Camera}
     * @public
     */
    this.camera = new Camera();
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

  draw(gameContext) {
    this.compositor.draw(gameContext.videoContext, this.camera);
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

    focusPlayer(this);

    this.totalTime += gameContext.deltaTime;
  }

  pause() {
    this.music.pause();
  }
}
