export default class MusicPlayer {
  constructor() {
    /**
     * @type {Map<string, HTMLAudioElement>}
     */
    this.tracks = new Map();
  }

  /**
   * @param {string} name
   * @param {string} url
   */
  addTrack(name, url) {
    const audio = new Audio();

    audio.loop = true;
    audio.src = url;

    this.tracks.set(name, audio);
  }

  playTrack(name) {
    this.pauseAll();

    const audio = this.tracks.get(name);
    audio.play();

    return audio;
  }

  pauseAll() {
    for (const audio of this.tracks.values()) {
      audio.pause();
    }
  }
}
