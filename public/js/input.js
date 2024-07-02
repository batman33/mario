import Entity from "./Entity.js";
import KeyboardState from "./KeyboardState.js";

/**
 * @param {Entity} entity
 * @returns {KeyboardState}
 */
export function setupKeyboard(mario) {
  const input = new KeyboardState();

  input.addMapping("KeyP", (keyState) => {
    if (keyState) {
      mario.jump.start();
    } else {
      mario.jump.cancel();
    }
  });

  input.addMapping("KeyO", (keyState) => {
    mario.turbo(keyState);
  });

  input.addMapping("KeyD", (keyState) => {
    mario.go.direction += keyState ? 1 : -1;
  });

  input.addMapping("KeyA", (keyState) => {
    mario.go.direction += -keyState ? -1 : 1;
  });

  return input;
}
