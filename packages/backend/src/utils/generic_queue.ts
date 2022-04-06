let _ = require('lodash');

class Queue<T> {
  _store: T[] = [];

  enqueue(val: T) {
    this._store.push(val);
  }

  dequeue(): T | undefined {
    return this._store.shift();
  }

  peek(): T {
    return this._store[0];
  }

  isEmpty(): boolean {
    return this._store.length === 0;
  }

  remove(value: T): T[] | null {
    for (let i = 0; i < this._store.length; i++) {
      if (_.isEqual(this._store[i], value)) {
        return this._store.splice(i, 1);
      }
    }
    return null;
  }
}

export default Queue;
