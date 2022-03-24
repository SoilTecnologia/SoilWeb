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
exports.putPivotController = exports.deletePivotController = exports.createPivotControllerAdm = exports.getOnePivotController = exports.getAllPivotController = exports.updatePivotController = exports.readListPivotController = exports.readMapPivotController = exports.readAllPivotsController2 = exports.readOnePivotController = exports.readAllPivotController = exports.createPivotController = void 0;
var database_1 = __importDefault(require("../database"));
var eventBus_1 = __importDefault(require("../utils/eventBus"));
var isDifferent_1 = require("../utils/isDifferent");
var cycles_1 = require("./cycles");
var createPivotController = function (pivot_id, node_id, radio_id, pivot_num, pivot_lng, pivot_lat, pivot_start_angle, pivot_end_angle, pivot_radius) { return __awaiter(void 0, void 0, void 0, function () {
    var newPivot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('pivots').insert({
                    pivot_id: pivot_id,
                    node_id: node_id,
                    radio_id: radio_id,
                    pivot_num: pivot_num,
                    pivot_lng: pivot_lng,
                    pivot_lat: pivot_lat,
                    pivot_start_angle: pivot_start_angle,
                    pivot_end_angle: pivot_end_angle,
                    pivot_radius: pivot_radius
                })];
            case 1:
                newPivot = _a.sent();
                return [2 /*return*/, newPivot];
        }
    });
}); };
exports.createPivotController = createPivotController;
var readAllPivotController = function (farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var pivots;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('pivots')
                    .select('*')
                    .join('nodes', 'pivots.node_id', 'nodes.node_id')
                    .where('nodes.farm_id', farm_id)];
            case 1:
                pivots = _a.sent();
                return [2 /*return*/, pivots];
        }
    });
}); };
exports.readAllPivotController = readAllPivotController;
var readOnePivotController = function (pivot_id) { return __awaiter(void 0, void 0, void 0, function () {
    var pivot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('pivots')
                    .select('*')
                    .where({ pivot_id: pivot_id })
                    .first()];
            case 1:
                pivot = _a.sent();
                return [2 /*return*/, pivot];
        }
    });
}); };
exports.readOnePivotController = readOnePivotController;
var readAllPivotsController2 = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pivots;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('pivots').select('*')];
            case 1:
                pivots = _a.sent();
                return [2 /*return*/, pivots];
        }
    });
}); };
exports.readAllPivotsController2 = readAllPivotsController2;
var readMapPivotController = function (user_id, farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var pivotArray, farm, nodes, _i, nodes_1, node, pivots, _a, pivots_1, pivot, state, variables;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                pivotArray = [];
                return [4 /*yield*/, (0, database_1.default)('farms')
                        .select('farm_lng', 'farm_lat')
                        .where('farm_id', farm_id)
                        .first()];
            case 1:
                farm = _b.sent();
                return [4 /*yield*/, (0, database_1.default)('nodes')
                        .select('node_id')
                        .where('farm_id', farm_id)];
            case 2:
                nodes = _b.sent();
                _i = 0, nodes_1 = nodes;
                _b.label = 3;
            case 3:
                if (!(_i < nodes_1.length)) return [3 /*break*/, 10];
                node = nodes_1[_i];
                return [4 /*yield*/, (0, database_1.default)('pivots')
                        .select('pivot_id', 'pivot_num', 'pivot_lng', 'pivot_lat', 'pivot_start_angle', 'pivot_end_angle', 'pivot_radius')
                        .where('node_id', node.node_id)];
            case 4:
                pivots = _b.sent();
                _a = 0, pivots_1 = pivots;
                _b.label = 5;
            case 5:
                if (!(_a < pivots_1.length)) return [3 /*break*/, 9];
                pivot = pivots_1[_a];
                return [4 /*yield*/, (0, database_1.default)('states')
                        .select('state_id', 'power', 'water', 'direction', 'connection')
                        .where('pivot_id', pivot.pivot_id)
                        .orderBy('timestamp', 'desc')
                        .first()];
            case 6:
                state = _b.sent();
                return [4 /*yield*/, (0, cycles_1.getLastCycleFromPivot)(pivot.pivot_id)];
            case 7:
                variables = _b.sent();
                if (state && variables && variables.length > 0) {
                    pivotArray.push({
                        pivot_id: pivot.pivot_id,
                        pivot_lng: pivot.pivot_lng,
                        pivot_lat: pivot.pivot_lat,
                        pivot_num: pivot.pivot_num,
                        pivot_start_angle: pivot.pivot_start_angle,
                        pivot_end_angle: pivot.pivot_end_angle,
                        pivot_radius: pivot.pivot_radius,
                        power: state.power,
                        water: state.water,
                        direction: state.direction,
                        connection: state.connection,
                        start_angle: variables[0].angle,
                        end_angle: variables[variables.length - 1].angle
                    });
                }
                else {
                    pivotArray.push({
                        pivot_id: pivot.pivot_id,
                        pivot_lng: pivot.pivot_lng,
                        pivot_lat: pivot.pivot_lat,
                        pivot_num: pivot.pivot_num,
                        pivot_start_angle: pivot.pivot_start_angle,
                        pivot_end_angle: pivot.pivot_end_angle,
                        pivot_radius: pivot.pivot_radius,
                        power: false,
                        water: false,
                        direction: null,
                        connection: true,
                        start_angle: pivot.pivot_start_angle,
                        end_angle: pivot.pivot_start_angle
                    });
                }
                _b.label = 8;
            case 8:
                _a++;
                return [3 /*break*/, 5];
            case 9:
                _i++;
                return [3 /*break*/, 3];
            case 10: return [2 /*return*/, {
                    farm_lat: farm.farm_lat,
                    farm_lng: farm.farm_lng,
                    pivots: pivotArray
                }];
        }
    });
}); };
exports.readMapPivotController = readMapPivotController;
var readListPivotController = function (user_id, farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var response, pivots, _i, pivots_2, pivot, state, variable;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                response = [];
                return [4 /*yield*/, (0, database_1.default)('pivots').select().where({ farm_id: farm_id })];
            case 1:
                pivots = _a.sent();
                _i = 0, pivots_2 = pivots;
                _a.label = 2;
            case 2:
                if (!(_i < pivots_2.length)) return [3 /*break*/, 7];
                pivot = pivots_2[_i];
                return [4 /*yield*/, (0, database_1.default)('states')
                        .select('state_id', 'power', 'water', 'direction')
                        .where('pivot_id', pivot.pivot_id)
                        .orderBy('timestamp', 'desc')
                        .first()];
            case 3:
                state = _a.sent();
                if (!state) return [3 /*break*/, 5];
                return [4 /*yield*/, (0, database_1.default)('state_variables')
                        .select('percentimeter', 'timestamp')
                        .where('state_id', state.state_id)
                        .orderBy('timestamp', 'desc')
                        .first()];
            case 4:
                variable = _a.sent();
                response.push({
                    pivot_id: pivot.pivot_id,
                    pivot_num: pivot.pivot_num,
                    power: state.power,
                    water: state.water,
                    direction: state.direction,
                    percentimeter: variable ? variable.percentimeter : null,
                    rssi: null,
                    father: null,
                    timestamp: variable ? new Date(variable.timestamp) : null
                });
                return [3 /*break*/, 6];
            case 5:
                response.push({
                    pivot_id: pivot.pivot_id,
                    pivot_num: pivot.pivot_num,
                    power: false,
                    water: false,
                    direction: null,
                    percentimeter: 0,
                    rssi: null,
                    father: null,
                    timestamp: null
                });
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [2 /*return*/, response];
        }
    });
}); };
exports.readListPivotController = readListPivotController;
var updatePivotController = function (pivot_id, connection, power, water, direction, angle, percentimeter, timestamp, father, rssi) { return __awaiter(void 0, void 0, void 0, function () {
    var shouldNotifyUpdate, shouldNotifyState, state, oldState, newState, oldStateVariable, oldRadioVariable, pivot, farm_id, node_id, pivot_num, node, node_num, farm, user_id, farm_name;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                shouldNotifyUpdate = false;
                shouldNotifyState = false;
                return [4 /*yield*/, (0, database_1.default)('states')
                        .where('pivot_id', pivot_id)
                        .orderBy('timestamp', 'desc')
                        .first()];
            case 1:
                oldState = _a.sent();
                state = oldState;
                if (!(!oldState ||
                    (0, isDifferent_1.isStateDifferent)(oldState, { connection: connection, power: power, water: water, direction: direction }))) return [3 /*break*/, 3];
                shouldNotifyUpdate = true;
                shouldNotifyState = true;
                return [4 /*yield*/, (0, database_1.default)('states')
                        .insert({
                        pivot_id: pivot_id,
                        connection: connection,
                        power: power,
                        water: water,
                        direction: direction,
                        timestamp: new Date(timestamp)
                    })
                        .returning('*')];
            case 2:
                newState = _a.sent();
                state = newState[0];
                _a.label = 3;
            case 3:
                if (!(angle !== undefined && percentimeter !== undefined)) return [3 /*break*/, 6];
                if (!state) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, database_1.default)('state_variables')
                        .where('state_id', state.state_id)
                        .orderBy('timestamp', 'desc')
                        .first()];
            case 4:
                oldStateVariable = _a.sent();
                if (!(!oldStateVariable ||
                    (0, isDifferent_1.isStateVariableDifferent)(oldStateVariable, { angle: angle, percentimeter: percentimeter }))) return [3 /*break*/, 6];
                shouldNotifyUpdate = true;
                return [4 /*yield*/, (0, database_1.default)('state_variables').insert({
                        state_id: state.state_id,
                        angle: angle,
                        percentimeter: percentimeter,
                        timestamp: new Date(timestamp)
                    })];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6:
                if (!(father !== undefined && rssi !== undefined)) return [3 /*break*/, 9];
                return [4 /*yield*/, (0, database_1.default)('radio_variables')
                        .where('pivot_id', pivot_id)
                        .orderBy('timestamp', 'desc')
                        .first()];
            case 7:
                oldRadioVariable = _a.sent();
                if (!(!oldRadioVariable ||
                    (0, isDifferent_1.isRadioVariableDifferent)(oldRadioVariable, { father: father, rssi: rssi }))) return [3 /*break*/, 9];
                shouldNotifyUpdate = true;
                return [4 /*yield*/, (0, database_1.default)('radio_variables').insert({
                        pivot_id: pivot_id,
                        state_id: state.state_id,
                        father: father,
                        rssi: rssi,
                        timestamp: new Date(timestamp)
                    })];
            case 8:
                _a.sent();
                _a.label = 9;
            case 9:
                if (!shouldNotifyUpdate) return [3 /*break*/, 13];
                return [4 /*yield*/, (0, database_1.default)('pivots').select('*').where({ pivot_id: pivot_id }).first()];
            case 10:
                pivot = _a.sent();
                farm_id = pivot.farm_id, node_id = pivot.node_id, pivot_num = pivot.pivot_num;
                return [4 /*yield*/, (0, database_1.default)('nodes').select('*').where({ node_id: node_id }).first()];
            case 11:
                node = _a.sent();
                node_num = node.node_num;
                return [4 /*yield*/, (0, database_1.default)('farms').select('*').where({ farm_id: farm_id }).first()];
            case 12:
                farm = _a.sent();
                user_id = farm.user_id, farm_name = farm.farm_name;
                eventBus_1.default.emit('status', {
                    farm_id: farm_id,
                    node_num: node_num,
                    payload: {
                        pivot_id: pivot_id,
                        connection: connection,
                        power: power,
                        water: water,
                        direction: direction,
                        angle: angle,
                        percentimeter: percentimeter,
                        timestamp: timestamp,
                        father: father,
                        rssi: rssi
                    }
                });
                if (shouldNotifyState) {
                    eventBus_1.default.emit('state-change', {
                        user_id: user_id,
                        pivot_id: pivot_id,
                        pivot_num: pivot_num,
                        farm_name: farm_name,
                        power: power,
                        water: water,
                        direction: direction,
                        connection: connection,
                        percentimeter: percentimeter
                    });
                }
                else {
                    eventBus_1.default.emit('variable-change', {
                        user_id: user_id,
                        pivot_id: pivot_id,
                        percentimeter: percentimeter,
                        angle: angle
                    });
                }
                _a.label = 13;
            case 13: return [2 /*return*/];
        }
    });
}); };
exports.updatePivotController = updatePivotController;
// Admin
var getAllPivotController = function (farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var pivots;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('pivots').select().where({ farm_id: farm_id })];
            case 1:
                pivots = _a.sent();
                return [2 /*return*/, pivots];
        }
    });
}); };
exports.getAllPivotController = getAllPivotController;
var getOnePivotController = function (pivot_num, farm_id) { return __awaiter(void 0, void 0, void 0, function () {
    var pivots;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, database_1.default)('pivots')
                    .select()
                    .where({ farm_id: farm_id, pivot_num: pivot_num })
                    .first()];
            case 1:
                pivots = _a.sent();
                return [2 /*return*/, pivots];
        }
    });
}); };
exports.getOnePivotController = getOnePivotController;
var createPivotControllerAdm = function (pivot) { return __awaiter(void 0, void 0, void 0, function () {
    var pivot_id, newPivot, pivots;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pivot_id = "".concat(pivot.farm_id, "_").concat(pivot.pivot_num);
                newPivot = __assign(__assign({}, pivot), { pivot_id: pivot_id });
                return [4 /*yield*/, (0, database_1.default)('pivots').insert(newPivot)];
            case 1:
                pivots = _a.sent();
                return [2 /*return*/, pivots];
        }
    });
}); };
exports.createPivotControllerAdm = createPivotControllerAdm;
var deletePivotController = function (pivot_id) { return __awaiter(void 0, void 0, void 0, function () {
    var farm, delResult, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                return [4 /*yield*/, (0, database_1.default)('pivots')
                        .select()
                        .where({ pivot_id: pivot_id })
                        .first()];
            case 1:
                farm = _a.sent();
                if (!farm) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, database_1.default)('pivots')
                        .select()
                        .where({ pivot_id: pivot_id })
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
exports.deletePivotController = deletePivotController;
var putPivotController = function (pivot) { return __awaiter(void 0, void 0, void 0, function () {
    var pivot_id, getPivot, newFarm;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pivot_id = "".concat(pivot.farm_id, "_").concat(pivot.pivot_num);
                return [4 /*yield*/, (0, database_1.default)('pivots')
                        .select()
                        .where({ pivot_id: pivot.pivot_id })
                        .first()];
            case 1:
                getPivot = _a.sent();
                if (!getPivot) return [3 /*break*/, 4];
                return [4 /*yield*/, (0, database_1.default)('pivots')
                        .where({ pivot_id: pivot.pivot_id })
                        .update(__assign(__assign({}, getPivot), { pivot_id: pivot_id, pivot_lat: pivot.pivot_lat ? pivot.pivot_lat : getPivot.pivot_lat, pivot_lng: pivot.pivot_lng ? pivot.pivot_lng : getPivot.pivot_lng, pivot_num: pivot.pivot_num ? pivot.pivot_num : getPivot.pivot_num, pivot_radius: pivot.pivot_radius
                            ? pivot.pivot_radius
                            : getPivot.pivot_radius, pivot_start_angle: pivot.pivot_start_angle
                            ? pivot.pivot_start_angle
                            : getPivot.pivot_start_angle, pivot_end_angle: pivot.pivot_end_angle
                            ? pivot.pivot_end_angle
                            : getPivot.pivot_end_angle, radio_id: pivot.radio_id ? pivot.radio_id : getPivot.radio_id }))];
            case 2:
                _a.sent();
                return [4 /*yield*/, (0, database_1.default)('pivots')
                        .select()
                        .where({ pivot_id: pivot.pivot_id })
                        .first()];
            case 3:
                newFarm = _a.sent();
                return [2 /*return*/, newFarm];
            case 4: throw new Error('Não fooi possivel atualizar Pivot');
        }
    });
}); };
exports.putPivotController = putPivotController;
