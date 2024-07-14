import Entity from "../Entity.js";
import Killable from "../traits/Killable.js";
import PendulumMove from "../traits/PendulumMove.js";
import Physics from "../traits/Physics.js";
import Solid from "../traits/Solid.js";
import Stomper from "../traits/Stomper.js";
import Trait from "../Trait.js";
import { loadSpriteSheet } from "../loaders/sprite.js";

export function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

class Behavior extends Trait {
  constructor() {
    super();

    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.walkSpeed = undefined;
    this.panicSpeed = 200;
    this.hideDuration = 5;
  }

  collides(us, them) {
    if (us.traits.get(Killable).dead) {
      return;
    }

    if (them.traits.has(Stomper)) {
      if (them.vel.y > us.vel.y) {
        this.handleStomp(us, them);
      } else {
        this.handleNudge(us, them);
      }
    }
  }

  handleNudge(us, them) {
    if (this.state === STATE_WALKING) {
      them.traits.get(Killable).kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(us, them);
    } else if (this.state === STATE_PANIC) {
      const travelDirection = Math.sign(us.vel.x);
      const impactDirection = Math.sign(us.pos.x - them.pos.x);

      if (travelDirection !== 0 && travelDirection !== impactDirection) {
        them.traits.get(Killable).kill();
      }
    }
  }

  handleStomp(us, them) {
    if (this.state === STATE_WALKING) {
      this.hide(us);
    } else if (this.state === STATE_HIDING) {
      us.traits.get(Killable).kill();
      us.vel.set(100, -200);
      us.traits.get(Solid).obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(us);
    }
  }

  hide(us) {
    us.vel.x = 0;
    us.traits.get(PendulumMove).enabled = false;

    if (this.walkSpeed === undefined) {
      this.walkSpeed = us.traits.get(PendulumMove).speed;
    }

    this.hideTime = 0;
    this.state = STATE_HIDING;
  }

  unhide(us) {
    us.traits.get(PendulumMove).enabled = true;
    us.traits.get(PendulumMove).speed = this.walkSpeed;
    this.walkSpeed = undefined;
    this.state = STATE_WALKING;
  }

  panic(us, them) {
    us.traits.get(PendulumMove).enabled = true;
    us.traits.get(PendulumMove).speed = this.panicSpeed * Math.sign(them.vel.x);
    this.state = STATE_PANIC;
  }

  update(us, { deltaTime }) {
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
    if (koopa.traits.get(Behavior).state === STATE_HIDING || koopa.traits.get(Behavior).state === STATE_PANIC) {
      if (koopa.traits.get(Behavior).hideTime > 3) {
        return wakeAnimation(koopa.traits.get(Behavior).hideTime);
      }

      return "hiding";
    }

    if (koopa.traits.get(Behavior).state === STATE_PANIC) {
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
