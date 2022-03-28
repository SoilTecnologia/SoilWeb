"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRequestBody = exports.InvalidCredentials = exports.DuplicateUniqueError = exports.ServerError = void 0;
var ServerError = /** @class */ (function (_super) {
    __extends(ServerError, _super);
    function ServerError(status, message) {
        var _this = _super.call(this, message) || this;
        _this.status = status;
        Object.setPrototypeOf(_this, ServerError.prototype);
        return _this;
    }
    return ServerError;
}(Error));
exports.ServerError = ServerError;
var DuplicateUniqueError = /** @class */ (function (_super) {
    __extends(DuplicateUniqueError, _super);
    // Normal signature with defaults
    function DuplicateUniqueError(identifier) {
        var _this = _super.call(this, 400, "Row with same unique identifier '".concat(identifier, "' already exists!")) || this;
        Object.setPrototypeOf(_this, DuplicateUniqueError.prototype);
        return _this;
    }
    return DuplicateUniqueError;
}(ServerError));
exports.DuplicateUniqueError = DuplicateUniqueError;
var InvalidCredentials = /** @class */ (function (_super) {
    __extends(InvalidCredentials, _super);
    // Normal signature with defaults
    function InvalidCredentials() {
        var _this = _super.call(this, 400, "Invalid Credentials or user not found!") || this;
        Object.setPrototypeOf(_this, InvalidCredentials.prototype);
        return _this;
    }
    return InvalidCredentials;
}(ServerError));
exports.InvalidCredentials = InvalidCredentials;
var InvalidRequestBody = /** @class */ (function (_super) {
    __extends(InvalidRequestBody, _super);
    // Normal signature with defaults
    function InvalidRequestBody(identifiers) {
        var _this = _super.call(this, "Invalid data on request body: ".concat(identifiers)) || this;
        Object.setPrototypeOf(_this, InvalidRequestBody.prototype);
        return _this;
    }
    return InvalidRequestBody;
}(Error));
exports.InvalidRequestBody = InvalidRequestBody;
