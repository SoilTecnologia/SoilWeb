"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var Queue = /** @class */ (function () {
    function Queue() {
        this._store = [];
        // _cleanupValue(val: T) {
        // }
    }
    Queue.prototype.enqueue = function (val) {
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
    Queue.prototype.dequeue = function () {
        return this._store.shift();
    };
    Queue.prototype.peek = function () {
        return this._store[0];
    };
    Queue.prototype.isEmpty = function () {
        return this._store.length === 0;
    };
    Queue.prototype.remove = function (value) {
        for (var i = 0; i < this._store.length; i++) {
            if (_.isEqual(this._store[i], value)) {
                return this._store.splice(i, 1);
            }
        }
        return null;
    };
    return Queue;
}());
exports.default = Queue;
