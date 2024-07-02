const PRESSED = 1;
const RELEASED = 0;

export default class KeyboardState {
  constructor() {
    /**
     * Holds the current state of a given key
     * @type {Map<number, number>}
     */
    this.keyStates = new Map();

    /**
     * Holds the callback functions for a key code
     * @type {Map<number, function>}
     */
    this.keyMap = new Map();
  }

  addMapping(code, callback) {
    this.keyMap.set(code, callback);
  }

  /**
   * @param {KeyboardEvent} event
   */
  handleEvent(event) {
    const { code } = event;

    if (!this.keyMap.has(code)) {
      // Did not have key mapped
      return;
    }

    event.preventDefault();

    const keyState = event.type === "keydown" ? PRESSED : RELEASED;

    if (this.keyStates.get(code) === keyState) {
      return;
    }

    this.keyStates.set(code, keyState);

    this.keyMap.get(code)(keyState);
  }

  listenTo(window) {
    ["keydown", "keyup"].forEach((eventName) => {
      window.addEventListener(eventName, (event) => {
        this.handleEvent(event);
      });
    });
  }
}
