"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var MessageQueue = /** @class */ (function () {
    function MessageQueue() {
        this._store = [];
    }
    MessageQueue.prototype.enqueue = function (val) {
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
    };
    MessageQueue.prototype.dequeue = function () {
        return this._store.shift();
    };
    MessageQueue.prototype.peek = function () {
        return this._store[0];
    };
    MessageQueue.prototype.isEmpty = function () {
        return this._store.length === 0;
    };
    MessageQueue.prototype.remove = function (value) {
        for (var i = 0; i < this._store.length; i++) {
            var inQueue = this._store[i];
            var newValue = value;
            delete inQueue.attempts;
            delete newValue.attempts;
            if (_.isEqual(inQueue, newValue)) {
                return this._store.splice(i, 1);
            }
        }
        return null;
    };
    return MessageQueue;
}());
exports.default = MessageQueue;
