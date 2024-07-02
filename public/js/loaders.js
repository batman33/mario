import Level from "./Level.js";
import SpriteSheet from "./SpriteSheet.js";
import { createAnimation } from "./animation.js";
import { createBackgroundLayer, createSpriteLayer } from "./layers.js";

/**
 * @param {string} url
 * @returns {Promise<Image>}
 */
export function loadImage(url) {
  return new Promise((resolve) => {
    const image = new Image();
    image.addEventListener("load", () => {
      resolve(image);
    });
    image.src = url;
  });
}

export function loadJSON(url) {
  return fetch(url).then((r) => r.json());
}

/**
 *
 * @param {Level} level
 * @param {Object} backgrounds
 */
export function createTiles(level, backgrounds) {
  function applyRange(background, xStart, xLength, yStart, yLength) {
    const xEnd = xStart + xLength;
    const yEnd = yStart + yLength;
    for (let x = xStart; x < xEnd; x++) {
      for (let y = yStart; y < yEnd; y++) {
        level.tiles.set(x, y, {
          name: background.tile,
          type: background.type,
        });
      }
    }
  }

  backgrounds.forEach((background) => {
    background.ranges.forEach((range) => {
      if (range.length === 4) {
        const [xStart, xLength, yStart, yLength] = range;
        applyRange(background, xStart, xLength, yStart, yLength);
      } else if (range.length === 3) {
        const [xStart, xLength, yStart] = range;
        applyRange(background, xStart, xLength, yStart, 1);
      } else if (range.length === 2) {
        const [xStart, yStart] = range;
        applyRange(background, xStart, 1, yStart, 1);
      }
    });
  });
}

export function loadSpriteSheet(name) {
  return loadJSON(`/sprites/${name}.json`).then((sheetSpec) =>
    Promise.all([sheetSpec, loadImage(sheetSpec.imageURL)]).then(
      ([sheetSpec, image]) => {
        const sprites = new SpriteSheet(
          image,
          sheetSpec.tileW,
          sheetSpec.tileH
        );

        if (sheetSpec.tiles) {
          sheetSpec.tiles.forEach((tileSpec) => {
            sprites.defineTile(tileSpec.name, ...tileSpec.index);
          });
        }

        if (sheetSpec.frames) {
          sheetSpec.frames.forEach((frameSpec) => {
            sprites.define(frameSpec.name, ...frameSpec.rect);
          });
        }

        if (sheetSpec.animations) {
          sheetSpec.animations.forEach((animationSpec) => {
            const animation = createAnimation(
              animationSpec.frames,
              animationSpec.frameLength
            );
            sprites.defineAnimation(animationSpec.name, animation);
          });
        }

        return sprites;
      }
    )
  );
}

export function loadLevel(name) {
  return loadJSON(`/levels/${name}.json`)
    .then((levelSpec) =>
      Promise.all([levelSpec, loadSpriteSheet(levelSpec.spriteSheet)])
    )
    .then(([levelSpec, backgroundSprites]) => {
      const level = new Level();

      createTiles(level, levelSpec.backgrounds);

      const backgroundLayer = createBackgroundLayer(level, backgroundSprites);
      level.compositor.layers.push(backgroundLayer);

      const spriteLayer = createSpriteLayer(level.entities);
      level.compositor.layers.push(spriteLayer);

      return level;
    });
}
