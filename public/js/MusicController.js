import MusicPlayer from "./MusicPlayer.js";

export default class MusicController {
  constructor() {
    this.player = undefined;
  }

  /**
   * @param {MusicPlayer} player
   */
  setPlayer(player) {
    this.player = player;
  }
}
