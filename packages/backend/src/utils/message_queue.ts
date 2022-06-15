import MessageQueueType from '../protocols/message_queue';

let _ = require('lodash');

class MessageQueue {
  _store: MessageQueueType[] = [];

  enqueue(val: MessageQueueType) {
    this._store.push(val);
  }

  dequeue(): MessageQueueType | undefined {
    return this._store.shift();
  }

  peek(): MessageQueueType {
    return this._store[0];
  }

  isEmpty(): boolean {
    return this._store.length === 0;
  }

  remove(value: MessageQueueType): MessageQueueType[] | null {
    const newStore = this._store.filter((item) => item.id !== value.id);
    this._store = newStore;
    return null;
  }
}

export default MessageQueue;
