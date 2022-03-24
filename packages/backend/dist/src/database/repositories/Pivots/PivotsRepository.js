"use strict";
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
exports.PivotsRepository = void 0;
var __1 = __importDefault(require("../.."));
var PivotsRepository = /** @class */ (function () {
    function PivotsRepository() {
    }
    PivotsRepository.prototype.findById = function (pivot_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots')
                            .select()
                            .where({ pivot_id: pivot_id })
                            .first()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PivotsRepository.prototype.findAll = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots').select()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PivotsRepository.prototype.findByNodeId = function (node_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots').select().where({ node_id: node_id })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PivotsRepository.prototype.create = function (pivot) {
        return __awaiter(this, void 0, void 0, function () {
            var newPivot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots')
                            .insert(pivot)
                            .returning('*')];
                    case 1:
                        newPivot = _a.sent();
                        return [2 /*return*/, newPivot[0]];
                }
            });
        });
    };
    PivotsRepository.prototype.getAll = function (farm_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots').select().where({ farm_id: farm_id })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PivotsRepository.prototype.getOne = function (pivot_num, farm_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots')
                            .select()
                            .where({ farm_id: farm_id, pivot_num: pivot_num })
                            .first()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PivotsRepository.prototype.delete = function (pivot_id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots').select().where({ pivot_id: pivot_id }).del()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    PivotsRepository.prototype.update = function (pivot, pivot_id) {
        return __awaiter(this, void 0, void 0, function () {
            var pivots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots')
                            .where({ pivot_id: pivot_id })
                            .update(pivot)
                            .returning('*')];
                    case 1:
                        pivots = _a.sent();
                        return [2 /*return*/, pivots[0]];
                }
            });
        });
    };
    PivotsRepository.prototype.readAll = function (farm_id) {
        return __awaiter(this, void 0, void 0, function () {
            var pivots;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, __1.default)('pivots')
                            .select('*')
                            .join('nodes', 'pivots.node_id', 'nodes.node_id')
                            .where('nodes.farm_id', farm_id)];
                    case 1:
                        pivots = _a.sent();
                        return [2 /*return*/, pivots];
                }
            });
        });
    };
    return PivotsRepository;
}());
exports.PivotsRepository = PivotsRepository;
