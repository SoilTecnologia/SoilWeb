"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putNodeController = exports.deleteNodeController = exports.readWithNodeNumController = exports.readAllNodeController = exports.createNodeController = void 0;
var database_1 = __importDefault(require("../database"));
var createNodeController = function (node) { return __awaiter(void 0, void 0, void 0, function () {
    var newNode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('nodes').insert(node).returning('*')];
            case 1:
                newNode = _a.sent();
                return [2 /*return*/, newNode[0]];
        }
    });
}); };
exports.createNodeController = createNodeController;
var readAllNodeController = function (farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var allNodesFromFarm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('nodes')
                    .select('*')
                    .where({ farm_id: farm_id })];
            case 1:
                allNodesFromFarm = _a.sent();
                return [2 /*return*/, allNodesFromFarm];
        }
    });
}); };
exports.readAllNodeController = readAllNodeController;
var readWithNodeNumController = function (farm_id, node_num) { return __awaiter(void 0, void 0, void 0, function () {
    var allNodesFromFarm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('nodes')
                    .select()
                    .where({ farm_id: farm_id, node_num: node_num })
                    .first()];
            case 1:
                allNodesFromFarm = _a.sent();
                return [2 /*return*/, allNodesFromFarm];
        }
    });
}); };
exports.readWithNodeNumController = readWithNodeNumController;
var deleteNodeController = function (node_id) { return __awaiter(void 0, void 0, void 0, function () {
    var farm, delResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!node_id) return [3 /*break*/, 6];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, (0, database_1.default)('nodes')
                        .select()
                        .where({ node_id: node_id })
                        .first()];
            case 2:
                farm = _a.sent();
                if (!farm) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, database_1.default)('nodes')
                        .select()
                        .where({ node_id: node_id })
                        .del()];
            case 3:
                delResult = _a.sent();
                return [2 /*return*/, delResult];
            case 4: return [3 /*break*/, 6];
            case 5:
                err_1 = _a.sent();
                console.log('[ERROR] Internal Server Error');
                console.log(err_1);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.deleteNodeController = deleteNodeController;
var putNodeController = function (node) { return __awaiter(void 0, void 0, void 0, function () {
    var getNode, newNode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('nodes')
                    .select()
                    .where({ node_id: node.node_id })
                    .first()];
            case 1:
                getNode = _a.sent();
                if (!getNode) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, database_1.default)('nodes')
                        .where({ node_id: node.node_id })
                        .update(__assign(__assign({}, getNode), { node_num: node.node_num ? node.node_num : getNode.node_num, is_gprs: node.is_gprs, gateway: node.gateway ? node.gateway : getNode.gateway }))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, database_1.default)('nodes')
                        .where({ node_id: node.node_id })
                        .select()
                        .first()];
            case 3:
                newNode = _a.sent();
                return [2 /*return*/, newNode];
            case 4: throw new Error('[ERROR] Node not find');
        }
    });
}); };
exports.putNodeController = putNodeController;
