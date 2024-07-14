import Entity from "./Entity.js";
import Player from "./traits/Player.js";
import PlayerController from "./traits/PlayerController.js";

export function createPlayerEnvironment(playerEntity) {
  const playerEnvironment = new Entity();
  const playerController = new PlayerController();
  playerController.checkPoint.set(64, 64);
  playerController.setPlayer(playerEntity);
  playerEnvironment.addTrait(playerController);
  return playerEnvironment;
}

export function makePlayer(entity, name) {
  const player = new Player();
  player.name = name;
  entity.addTrait(player);
}

export function* findPlayers(entities) {
  for (const entity of entities) {
    if (entity.traits.has(Player)) {
      yield entity;
    }
  }
}
