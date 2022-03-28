"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.UpdatePivotStateUseCase = void 0;
var tsyringe_1 = require("tsyringe");
var eventBus_1 = __importDefault(require("../../../utils/eventBus"));
var isDifferent_1 = require("../../../utils/isDifferent");
var CreateStateUseCase_1 = require("../../States/CreateStateUseCase");
var UpdatePivotStateUseCase = /** @class */ (function () {
    function UpdatePivotStateUseCase(pivotRepository, farmRepository, nodesRepository, stateRepository, stateVariableRepository, radioVariableRepository) {
        var _this = this;
        this.pivotRepository = pivotRepository;
        this.farmRepository = farmRepository;
        this.nodesRepository = nodesRepository;
        this.stateRepository = stateRepository;
        this.stateVariableRepository = stateVariableRepository;
        this.radioVariableRepository = radioVariableRepository;
        this.createStateIfNotExists = function (pivot_id, oldState, newState, timestamp) { return __awaiter(_this, void 0, void 0, function () {
            var createStateUseCase, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(!oldState || (0, isDifferent_1.isStateDifferent)(oldState, newState))) return [3 /*break*/, 2];
                        this.shouldNotifyUpdate = true;
                        this.shouldNotifyState = true;
                        createStateUseCase = tsyringe_1.container.resolve(CreateStateUseCase_1.CreateStateUseCase);
                        _a = this;
                        return [4 /*yield*/, createStateUseCase.execute({
                                pivot_id: pivot_id,
                                connection: newState.connection,
                                power: newState.power,
                                water: newState.water,
                                direction: newState.direction,
                                timestamp: timestamp
                            })];
                    case 1:
                        _a.state = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        }); };
        this.alterStateVariable = function (angle, percentimeter, timestamp) { return __awaiter(_this, void 0, void 0, function () {
            var oldStateVariable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(angle !== undefined && percentimeter !== undefined)) return [3 /*break*/, 3];
                        if (!this.state) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.stateVariableRepository.findByStateId(this.state.state_id)];
                    case 1:
                        oldStateVariable = _a.sent();
                        if (!(!oldStateVariable ||
                            (0, isDifferent_1.isStateVariableDifferent)(oldStateVariable, { angle: angle, percentimeter: percentimeter }))) return [3 /*break*/, 3];
                        this.shouldNotifyUpdate = true;
                        return [4 /*yield*/, this.stateVariableRepository.create({
                                state_id: this.state.state_id,
                                angle: angle,
                                percentimeter: percentimeter,
                                timestamp: new Date(timestamp)
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.alterRadioVariable = function (pivot_id, father, rssi, timestamp) { return __awaiter(_this, void 0, void 0, function () {
            var oldRadioVariable;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(father !== undefined && rssi !== undefined)) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.radioVariableRepository.findByPivotId(pivot_id)];
                    case 1:
                        oldRadioVariable = _a.sent();
                        if (!(!oldRadioVariable ||
                            (0, isDifferent_1.isRadioVariableDifferent)(oldRadioVariable, { father: father, rssi: rssi }))) return [3 /*break*/, 3];
                        this.shouldNotifyUpdate = true;
                        return [4 /*yield*/, this.radioVariableRepository.create({
                                pivot_id: pivot_id,
                                state_id: this.state.state_id,
                                father: father,
                                rssi: rssi,
                                timestamp: new Date(timestamp)
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        this.shouldNotifyUpdate = false;
        this.shouldNotifyState = false;
        this.state = undefined;
    }
    UpdatePivotStateUseCase.prototype.execute = function (pivot_id, connection, power, water, direction, angle, percentimeter, timestamp, father, rssi) {
        return __awaiter(this, void 0, void 0, function () {
            var oldState, newState, pivot, node, farm;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.stateRepository.findByPivotId(pivot_id)];
                    case 1:
                        oldState = _a.sent();
                        this.state = oldState;
                        newState = { connection: connection, power: power, water: water, direction: direction };
                        return [4 /*yield*/, this.createStateIfNotExists(pivot_id, oldState, newState, timestamp)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.alterStateVariable(angle, percentimeter, timestamp)];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, this.alterRadioVariable(pivot_id, father, rssi, timestamp)];
                    case 4:
                        _a.sent();
                        if (!this.shouldNotifyUpdate) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.pivotRepository.findById(pivot_id)];
                    case 5:
                        pivot = _a.sent();
                        return [4 /*yield*/, this.nodesRepository.findById(pivot === null || pivot === void 0 ? void 0 : pivot.node_id)];
                    case 6:
                        node = _a.sent();
                        return [4 /*yield*/, this.farmRepository.findById(pivot === null || pivot === void 0 ? void 0 : pivot.farm_id)];
                    case 7:
                        farm = _a.sent();
                        eventBus_1.default.emit('status', {
                            farm_id: pivot === null || pivot === void 0 ? void 0 : pivot.farm_id,
                            node_num: node === null || node === void 0 ? void 0 : node.node_num,
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
                        if (this.shouldNotifyState) {
                            eventBus_1.default.emit('state-change', {
                                user_id: farm === null || farm === void 0 ? void 0 : farm.user_id,
                                pivot_id: pivot_id,
                                pivot_num: pivot === null || pivot === void 0 ? void 0 : pivot.pivot_num,
                                farm_name: farm === null || farm === void 0 ? void 0 : farm.farm_name,
                                power: power,
                                water: water,
                                direction: direction,
                                connection: connection,
                                percentimeter: percentimeter
                            });
                        }
                        else {
                            eventBus_1.default.emit('variable-change', {
                                user_id: farm === null || farm === void 0 ? void 0 : farm.user_id,
                                pivot_id: pivot_id,
                                percentimeter: percentimeter,
                                angle: angle
                            });
                        }
                        _a.label = 8;
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    UpdatePivotStateUseCase = __decorate([
        (0, tsyringe_1.injectable)(),
        __param(0, (0, tsyringe_1.inject)('PivotsRepository')),
        __param(1, (0, tsyringe_1.inject)('FarmsRepository')),
        __param(2, (0, tsyringe_1.inject)('NodesRepository')),
        __param(3, (0, tsyringe_1.inject)('StatesRepository')),
        __param(4, (0, tsyringe_1.inject)('StatesVariablesRepository')),
        __param(5, (0, tsyringe_1.inject)('RadioVariablesRepository')),
        __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object])
    ], UpdatePivotStateUseCase);
    return UpdatePivotStateUseCase;
}());
exports.UpdatePivotStateUseCase = UpdatePivotStateUseCase;
