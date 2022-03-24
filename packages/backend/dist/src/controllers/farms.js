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
exports.putFarmController = exports.deleteFarmController = exports.readMapFarmControler = exports.getOneFarmController = exports.getAllFarmUser = exports.readAllFarmController = exports.createFarmController = void 0;
var database_1 = __importDefault(require("../database"));
var createFarmController = function (farm_id, user_id, farm_name, farm_city, farm_lng, farm_lat) { return __awaiter(void 0, void 0, void 0, function () {
    var newFarm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('farms').insert({
                    farm_id: farm_id,
                    user_id: user_id,
                    farm_name: farm_name,
                    farm_city: farm_city,
                    farm_lng: farm_lng,
                    farm_lat: farm_lat
                })];
            case 1:
                newFarm = _a.sent();
                return [2 /*return*/, newFarm];
        }
    });
}); };
exports.createFarmController = createFarmController;
var readAllFarmController = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var farms;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('farms')
                    .select('farm_name', 'farm_city', 'farm_id')
                    .where({ user_id: user_id })];
            case 1:
                farms = _a.sent();
                return [2 /*return*/, farms];
        }
    });
}); };
exports.readAllFarmController = readAllFarmController;
var getAllFarmUser = function (user_id) { return __awaiter(void 0, void 0, void 0, function () {
    var farms;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('farms').select().where({ user_id: user_id })];
            case 1:
                farms = _a.sent();
                return [2 /*return*/, farms];
        }
    });
}); };
exports.getAllFarmUser = getAllFarmUser;
var getOneFarmController = function (farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var farms;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('farms').select().where({ farm_id: farm_id }).first()];
            case 1:
                farms = _a.sent();
                return [2 /*return*/, farms];
        }
    });
}); };
exports.getOneFarmController = getOneFarmController;
var readMapFarmControler = function (farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('farms')
                    .join('nodes', 'farms.farm_id', 'nodes.farm_id')
                    .select('*')];
            case 1:
                result = _a.sent();
                return [2 /*return*/, result];
        }
    });
}); };
exports.readMapFarmControler = readMapFarmControler;
var deleteFarmController = function (farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var farm, delResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, database_1.default)('farms').select().where({ farm_id: farm_id }).first()];
            case 1:
                farm = _a.sent();
                if (!farm) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, database_1.default)('farms')
                        .select()
                        .where({ farm_id: farm_id })
                        .del()];
            case 2:
                delResult = _a.sent();
                return [2 /*return*/, delResult];
            case 3: return [3 /*break*/, 5];
            case 4:
                err_1 = _a.sent();
                console.log('[ERROR] Internal Server Error');
                console.log(err_1);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteFarmController = deleteFarmController;
var putFarmController = function (farm) { return __awaiter(void 0, void 0, void 0, function () {
    var getFarm, newFarm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('farms')
                    .select()
                    .where({ farm_id: farm.farm_id })
                    .first()];
            case 1:
                getFarm = _a.sent();
                if (!getFarm) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, database_1.default)('farms')
                        .where({ farm_id: farm.farm_id })
                        .update(__assign(__assign({}, getFarm), { farm_name: farm.farm_name ? farm.farm_name : getFarm.farm_name, farm_city: farm.farm_city ? farm.farm_city : getFarm.farm_city, farm_lng: farm.farm_lng ? farm.farm_lng : getFarm.farm_lng, farm_lat: farm.farm_lat ? farm.farm_lat : getFarm.farm_lat }))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, database_1.default)('farms')
                        .select()
                        .where({ farm_id: farm.farm_id })
                        .first()];
            case 3:
                newFarm = _a.sent();
                return [2 /*return*/, newFarm];
            case 4: throw new Error('[ERROR] Farm not find');
        }
    });
}); };
exports.putFarmController = putFarmController;
