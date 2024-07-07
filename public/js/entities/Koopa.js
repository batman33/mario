import Entity, { Trait } from "../Entity.js";
import Killable from "../traits/Killable.js";
import PendulumMove from "../traits/PendulumMove.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";
import { loadSpriteSheet } from "../loaders.js";

export function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
  constructor() {
    super("behavior");

    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.walkSpeed = undefined;
    this.panicSpeed = 200;
    this.hideDuration = 5;
  }

  collides(us, them) {
    if (us.killable.dead) {
      return;
    }

    if (them.stomper) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.killable.kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDirection = Math.sign(us.vel.x);
      const impactDirection = Math.sign(us.pos.x - them.pos.x);

      if (travelDirection !== 0 && travelDirection !== impactDirection) {
        them.killable.kill();
      }
    }
  }

  handleStomp(us, them) {
    if (this.state === STATE_WALKING) {
      this.hide(us);
    } else if (this.state === STATE_HIDING) {
      us.killable.kill();
      us.vel.set(100, -200);
      us.solid.obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.pendulumMove.enabled = false;

    if (this.walkSpeed === undefined) {
      this.walkSpeed = us.pendulumMove.speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.walkSpeed;
    this.walkSpeed = undefined;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.pendulumMove.enabled = true;
    us.pendulumMove.speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, deltaTime) {
    if (this.state === STATE_HIDING) {
      this.hideTime += deltaTime;

      if (this.hideTime > this.hideDuration) {
        this.unhide(us);
      }
    }
  }
}

function createKoopaFactory(sprite) {
  const walkAnimation = sprite.animations.get("walk");
  const wakeAnimation = sprite.animations.get("wake");

  function routeAnimation(koopa) {
    if (koopa.behavior.state === STATE_HIDING || koopa.behavior.state === STATE_PANIC) {
      if (koopa.behavior.hideTime > 3) {
        return wakeAnimation(koopa.behavior.hideTime);
      }

      return "hiding";
    }

    if (koopa.behavior.state === STATE_PANIC) {
      return "hiding";
    }

    return walkAnimation(koopa.lifeTime);
  }

  function drawKoopa(context) {
    sprite.draw(routeAnimation(this), context, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();
    koopa.size.set(16, 16);
    koopa.offset.y = 8;

    koopa.addTrait(new Physics());
    koopa.addTrait(new Solid());
    koopa.addTrait(new PendulumMove());
    koopa.addTrait(new Behavior());
    koopa.addTrait(new Killable());

    koopa.draw = drawKoopa;

    return koopa;
  };
}
