import EventEmitter from 'events';

const emitter = new EventEmitter();
emitter.setMaxListeners(emitter.getMaxListeners() + 1);

export default emitter;
