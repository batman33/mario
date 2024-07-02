import Entity from "./Entity.js";
import KeyboardState from "./KeyboardState.js";

/**
 * @param {Entity} entity
 * @returns {KeyboardState}
 */
export function setupKeyboard(entity) {
  const SPACE = 32;
  const LEFT = 39;
  const RIGHT = 37;
  const input = new KeyboardState();

  input.addMapping("Space", (keyState) => {
    if (keyState) {
      entity.jump.start();
    } else {
      entity.jump.cancel();
    }
  });

  input.addMapping("ArrowRight", (keyState) => {
    entity.go.direction = keyState;
  });

  input.addMapping("ArrowLeft", (keyState) => {
    entity.go.direction = -keyState;
  });

  return input;
}
