import Level from "./Level.js";
import Scene from "./Scene.js";
import SceneRunner from "./SceneRunner.js";
import TimedScene from "./TimedScene.js";
import Timer from "./Timer.js";
import { createCollisionLayer } from "./layers/collision.js";
import { createColorLayer } from "./layers/color.js";
import { createDashboardLayer } from "./layers/dashboard.js";
import { createLevelLoader } from "./loaders/level.js";
import { createPlayerEnvironment, findPlayers, makePlayer } from "./player.js";
import { createPlayerProgressLayer } from "./layers/player-progress.js";
import { createTextLayer } from "./layers/text.js";
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

  const mario = entityFactory.mario();
  makePlayer(mario, "MARIO");

  const inputRoute = setupKeyboard(window);
  inputRoute.addReceiver(mario);

  async function runLevel(name) {
    const loadScreen = new Scene();
    loadScreen.compositor.layers.push(createColorLayer("#000"));
    loadScreen.compositor.layers.push(createTextLayer(font, `Loading ${name}...`));
    sceneRunner.addScene(loadScreen);
    sceneRunner.runNext();

    const level = await loadLevel(name);

    level.events.listen(Level.EVENT_TRIGGER, (spec, trigger, touches) => {
      if (spec.type === "goto") {
        for (const _ of findPlayers(touches)) {
          runLevel(spec.name);
          return;
        }
      }
    });

    const playerProgressLayer = createPlayerProgressLayer(font, level);
    const dashboardLayer = createDashboardLayer(font, level);

    mario.pos.set(0, 0);
    level.entities.add(mario);

    const playerEnvironment = createPlayerEnvironment(mario);
    level.entities.add(playerEnvironment);

    const timedScreen = new TimedScene();
    timedScreen.compositor.layers.push(createColorLayer("#000"));
    timedScreen.compositor.layers.push(dashboardLayer);
    timedScreen.compositor.layers.push(playerProgressLayer);

    sceneRunner.addScene(timedScreen);

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

  await runLevel("1-1");
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
