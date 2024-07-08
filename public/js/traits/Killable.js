import { Trait } from "../Entity.js";

export default class Killable extends Trait {
  constructor() {
    super("killable");

    this.dead = false;
    this.deltaTime = 0;
    this.removeAfter = 2;
  }

  kill() {
    this.queue(() => (this.dead = true));
  }

  revive() {
    this.dead = false;
    this.deltaTime = 0;
  }

  update(entity, { deltaTime }, level) {
    if (this.dead) {
      this.deltaTime += deltaTime;

      if (this.deltaTime > this.removeAfter) {
        this.queue(() => {
          level.entities.delete(entity);
        });
      }
    }
  }
}
