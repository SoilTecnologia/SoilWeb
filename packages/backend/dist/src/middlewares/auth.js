"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*
  This middleware processes the token received on the request header Authorization.
  
  - Returns 200 and user details if it's valid
  - Returns 40x if the token is invalid or not provided
*/
var authMiddleware = function () {
    return function (req, res, next) {
        var token = req.headers.authorization;
        if (!token)
            return res.status(401).send('No token provided');
        try {
            var decode = (jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET));
            var wrappedRequest = req;
            wrappedRequest.user = decode;
            req = wrappedRequest;
            next();
        }
        catch (err) {
            res.status(401).send('Invalid Token!');
        }
    };
};
exports.default = authMiddleware;
