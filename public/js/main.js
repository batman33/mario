import Camera from "./Camera.js";
import Entity from "./Entity.js";
import PlayerController from "./traits/PlayerController.js";
import Timer from "./Timer.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createLevelLoader } from "./loaders/level.js";
import { loadEntities } from "./entities.js";
import { loadFont } from "./loaders/font.js";
import { setupKeyboard } from "./input.js";
import { createDashboardLayer } from "./layers/dahsboard.js";

function createPlayerEnvironment(playerEntity) {
  const playerEnvironment = new Entity();
  const playerController = new PlayerController();

  playerController.checkPoint.set(64, 64);

  playerController.setPlayer(playerEntity);
  playerEnvironment.addTrait(playerController);

  return playerEnvironment;
}

async function main(canvas) {
  /**
   * @type {CanvasRenderingContext2D} context
   */
  const context = canvas.getContext("2d");

  const [entityFactory, font] = await Promise.all([loadEntities(), loadFont()]);

  const loadLevel = await createLevelLoader(entityFactory);
  const level = await loadLevel("1-1");

  const camera = new Camera();

  const mario = entityFactory.mario();
  const playerEnvironment = createPlayerEnvironment(mario);
  level.entities.add(playerEnvironment);

  level.compositor.layers.push(createCollisionLayer(level));
  level.compositor.layers.push(createDashboardLayer(font, playerEnvironment));

  const input = setupKeyboard(mario);
  input.listenTo(window);

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    level.update(deltaTime);

    camera.pos.x = Math.max(0, mario.pos.x - 100);

    level.compositor.draw(context, camera);
  };

  timer.start();
}

/**
 * @type {HTMLCanvasElement} canvas
 */
const canvas = document.getElementById("screen");

main(canvas);
