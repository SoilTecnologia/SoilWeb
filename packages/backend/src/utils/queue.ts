import MessageQueue from "../types/message_queue";

var _ = require('lodash');

class Queue {
  _store: MessageQueue[] = [];

  enqueue(val: MessageQueue) {
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

  dequeue(): MessageQueue | undefined {
    return this._store.shift();
  }

  peek(): MessageQueue {
    return this._store[0];
  }

  isEmpty(): boolean {
    return this._store.length === 0;
  }

  remove(value: MessageQueue): MessageQueue[] | null {
    for (let i = 0; i < this._store.length; i++) {
      let inQueue = this._store[i];
      let newValue = value;

      delete inQueue.attempts;
      delete newValue.attempts;
      if(_.isEqual(inQueue, newValue)) {
        return this._store.splice(i, 1);
      }
    }
    return null;
  }
}

export default Queue;
