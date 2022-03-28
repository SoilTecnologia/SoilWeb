"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authHandler = void 0;
var authHandler = function (handler) {
    return function (req, res, next) {
        var requestWrapper = req;
        handler(requestWrapper, res, next);
    };
};
exports.authHandler = authHandler;
