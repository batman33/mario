import Camera from "./Camera.js";
import Timer from "./Timer.js";
import { loadEntities } from "./entities.js";
import { loadLevel } from "./loaders/level.js";
import { setupKeyboard } from "./input.js";
import { createCollisionLayer } from "./layers.js";

/**
 * @type {HTMLCanvasElement} canvas
 */
const canvas = document.getElementById("screen");
/**
 * @type {CanvasRenderingContext2D} context
 */
const context = canvas.getContext("2d");

Promise.all([loadEntities(), loadLevel("1-1")]).then(([entity, level]) => {
  const camera = new Camera();

  const goomba = entity.goomba();
  goomba.pos.x = 220;
  level.entities.add(goomba);

  const koopa = entity.koopa();
  koopa.pos.x = 260;
  level.entities.add(koopa);

  const mario = entity.mario();
  mario.pos.set(64, 64);
  level.entities.add(mario);

  level.compositor.layers.push(createCollisionLayer(level));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    if (mario.pos.x > 100) {
      camera.pos.x = mario.pos.x - 100;
    }

    level.compositor.draw(context, camera);
  };

  timer.start();
});
