export default class Trait {
  static EVENT_TASK = Symbol("task");

  constructor() {
    this.listeners = [];
  }

  listen(name, callback, count = Infinity) {
    this.listeners.push({ name, callback, count });
  }

  finalize(entity) {
    this.listeners = this.listeners.filter((listener) => {
      entity.events.process(listener.name, listener.callback);
      return --listener.count;
    });
  }

  queue(task) {
    this.listen(Trait.EVENT_TASK, task, 1);
  }

  /**
   * @param {Entity} entity
   * @param {"bottom"|"top"|"left"|"right"} side
   */
  obstruct(entity, side) {}

  /**
   * @param {Entity} us
   * @param {Entity} them
   */
  collides(us, them) {}

  update() {}
}
