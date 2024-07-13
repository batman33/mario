import Camera from "./Camera.js";
import Timer from "./Timer.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createLevelLoader } from "./loaders/level.js";
import { createPlayerEnvironment, createPlayer } from "./player.js";
import { loadEntities } from "./entities.js";
import { loadFont } from "./loaders/font.js";
import { setupKeyboard } from "./input.js";

async function main(canvas) {
  /**
   * @type {CanvasRenderingContext2D} context
   */
  const context = canvas.getContext("2d");
  /**
   * @type {AudioContext} audioContext
   */
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = await createLevelLoader(entityFactory);

  const level = await loadLevel("1-1");

  const camera = new Camera();

  const mario = createPlayer(entityFactory.mario());
  mario.player.name = "MARIO";
  level.entities.add(mario);

  const playerEnvironment = createPlayerEnvironment(mario);
  level.entities.add(playerEnvironment);

  level.compositor.layers.push(createCollisionLayer(level));
  level.compositor.layers.push(createDashboardLayer(font, level));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const gameContext = {
    audioContext,
    deltaTime: null,
    entityFactory,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;

    level.update(gameContext);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.compositor.draw(context, camera);
  };

  timer.start();
}

/**
 * @type {HTMLCanvasElement} canvas
 */
const canvas = document.getElementById("screen");

const start = () => {
  window.removeEventListener("click", start);
  main(canvas);
};

window.addEventListener("click", start);
