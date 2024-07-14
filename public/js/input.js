import Entity from "./Entity.js";
import Go from "./traits/Go.js";
import InputRouter from "./InputRouter.js";
import Jump from "./traits/Jump.js";
import KeyboardState from "./KeyboardState.js";

/**
 * @param {Entity} entity
 * @returns {KeyboardState}
 */
export function setupKeyboard(window) {
  const input = new KeyboardState();
  const router = new InputRouter();

  input.listenTo(window);

  input.addMapping("KeyP", (keyState) => {
    if (keyState) {
      router.route((entity) => entity.traits.get(Jump).start());
    } else {
      router.route((entity) => entity.traits.get(Jump).cancel());
    }
  });

  input.addMapping("KeyO", (keyState) => {
    router.route((entity) => entity.turbo(keyState));
  });

  input.addMapping("KeyD", (keyState) => {
    router.route((entity) => (entity.traits.get(Go).direction += keyState ? 1 : -1));
  });

  input.addMapping("KeyA", (keyState) => {
    router.route((entity) => (entity.traits.get(Go).direction += -keyState ? -1 : 1));
  });

  return router;
}
