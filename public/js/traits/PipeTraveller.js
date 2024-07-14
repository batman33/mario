import Trait from "../Trait.js";
import { Vec2 } from "../math.js";

export default class PipeTraveller extends Trait {
  constructor() {
    super();
    this.direction = new Vec2(0, 0);
    this.movement = new Vec2(0, 0);
    this.distance = new Vec2(0, 0);
  }
}
