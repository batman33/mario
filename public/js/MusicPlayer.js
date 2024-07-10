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
    const audio = this.tracks.get(name);
    if (audio) {
      audio.play();
    }
  }
}
