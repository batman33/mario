export class Matrix {
  constructor() {
    /**
     * @type {[][]}
     */
    this.grid = [];
  }

  forEach(callback) {
    this.grid.forEach((column, x) => {
      column.forEach((value, y) => {
        callback(value, x, y);
      });
    });
  }

  delete(x, y) {
    const col = this.grid[x];

    if (col) {
      delete col[y];
    }
  }

  get(x, y) {
    const col = this.grid[x];

    if (col) {
      return col[y];
    }

    return undefined;
  }

  set(x, y, value) {
    if (!this.grid[x]) {
      this.grid[x] = [];
    }

    this.grid[x][y] = value;
  }
}

export class Vec2 {
  /**
   * @param {number} x
   * @param {number} y
   */
  constructor(x, y) {
    this.set(x, y);
  }

  /**
   * @param {Vec2} vec2
   */
  copy(vec2) {
    this.x = vec2.x;
    this.y = vec2.y;
  }

  /**
   * @param {number} x
   * @param {number} y
   */
  set(x, y) {
    /**
     * @type {number}
     */
    this.x = x;
    /**
     * @type {number}
     */
    this.y = y;
  }
}
