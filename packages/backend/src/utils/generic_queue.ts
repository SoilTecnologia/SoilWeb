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
    const newStore = this._store.filter((item) => item !== value);
    this._store = newStore;
    return null;
  }
}

export default Queue;
