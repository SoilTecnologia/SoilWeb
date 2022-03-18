var _ = require('lodash');

class Queue<T> {
  _store: T[] = [];

  enqueue(val: T) {
    // (Object.keys(val) as Array<keyof T>).forEach((key) => {
    //   if (val[key] instanceof Object) {
    //     Object.keys(val[key]).forEach((key2) => {
    //       // @ts-ignore: Unreachable code error
    //       val[key][key2] === undefined ? delete val[key] : {};
    //     });
    //   } else {
    //     val[key] === undefined ? delete val[key] : {};
    //   }
    // });

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

  // _cleanupValue(val: T) {

  // }
}

export default Queue;