import CompositionScene from "./CompositionScene.js";
import Level from "./Level.js";
import SceneRunner from "./SceneRunner.js";
import Timer from "./Timer.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createColorLayer } from "./layers/color.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createLevelLoader } from "./loaders/level.js";
import { createPlayerEnvironment, createPlayer } from "./player.js";
import { createPlayerProgressLayer } from "./layers/player-progress.js";
import { loadEntities } from "./entities.js";
import { loadFont } from "./loaders/font.js";
import { setupKeyboard } from "./input.js";

async function main(canvas) {
  /**
   * @type {CanvasRenderingContext2D} videoContext
   */
  const videoContext = canvas.getContext("2d");
  /**
   * @type {AudioContext} audioContext
   */
  const audioContext = new AudioContext();

  const [entityFactory, font] = await Promise.all([loadEntities(audioContext), loadFont()]);

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneRunner = new SceneRunner();

  const mario = createPlayer(entityFactory.mario());
  mario.player.name = "MARIO";

  const inputRoute = setupKeyboard(window);
  inputRoute.addReceiver(mario);

  async function runLevel(name) {
    const level = await loadLevel(name);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === "goto") {
        for (const entity of touches) {
          if (entity.player) {
            runLevel(spec.name);
            return;
          }
        }
      }
    });

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);

    const playerEnvironment = createPlayerEnvironment(mario);
    level.entities.add(playerEnvironment);

    const waitScreen = new CompositionScene();
    waitScreen.compositor.layers.push(createColorLayer("#000"));
    waitScreen.compositor.layers.push(dashboardLayer);
    waitScreen.compositor.layers.push(playerProgressLayer);

    sceneRunner.addScene(waitScreen);

    level.compositor.layers.push(createCollisionLayer(level));
    level.compositor.layers.push(dashboardLayer);

    sceneRunner.addScene(level);
    sceneRunner.runNext();
  }

  const gameContext = {
    audioContext,
    deltaTime: null,
    entityFactory,
    videoContext,
  };

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.deltaTime = deltaTime;
    sceneRunner.update(gameContext);
  };

  timer.start();

  await runLevel("debug-progression");
  window.runLevel = runLevel;
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
