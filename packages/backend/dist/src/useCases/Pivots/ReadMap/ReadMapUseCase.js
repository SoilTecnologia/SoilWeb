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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReadMapUseCase = void 0;
var tsyringe_1 = require("tsyringe");
var GetLastCycleUseCase_1 = require("../../Cycles/GetLastCycles/GetLastCycleUseCase");
var ReadMapUseCase = /** @class */ (function () {
    function ReadMapUseCase(pivotRepository, farmRepository, nodeRepository, stateRepository) {
        var _this = this;
        this.pivotRepository = pivotRepository;
        this.farmRepository = farmRepository;
        this.nodeRepository = nodeRepository;
        this.stateRepository = stateRepository;
        this.handlePivotsResult = function (pivots) { return __awaiter(_this, void 0, void 0, function () {
            var getLastCycleUseCase, newArray, _i, pivots_1, pivot, state, variables, isTrue, statePivot;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        getLastCycleUseCase = tsyringe_1.container.resolve(GetLastCycleUseCase_1.GetLastCycleUseCase);
                        newArray = [];
                        _i = 0, pivots_1 = pivots;
                        _a.label = 1;
                    case 1:
                        if (!(_i < pivots_1.length)) return [3 /*break*/, 5];
                        pivot = pivots_1[_i];
                        return [4 /*yield*/, this.stateRepository.findByPivotId(pivot.pivot_id)];
                    case 2:
                        state = _a.sent();
                        return [4 /*yield*/, getLastCycleUseCase.execute(pivot.pivot_id)];
                    case 3:
                        variables = _a.sent();
                        isTrue = state && variables && variables.length > 0;
                        statePivot = {
                            pivot_id: pivot.pivot_id,
                            pivot_lng: pivot.pivot_lng,
                            pivot_lat: pivot.pivot_lat,
                            pivot_num: pivot.pivot_num,
                            pivot_start_angle: pivot.pivot_start_angle,
                            pivot_end_angle: pivot.pivot_end_angle,
                            pivot_radius: pivot.pivot_radius,
                            power: isTrue ? state.power : false,
                            water: isTrue ? state.water : false,
                            direction: isTrue ? state.direction : null,
                            connection: isTrue ? state.connection : true,
                            start_angle: isTrue ? variables[0].angle : pivot.pivot_start_angle,
                            end_angle: isTrue
                                ? variables[variables.length - 1].angle
                                : pivot.pivot_start_angle
                        };
                        newArray.push(statePivot);
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/, newArray];
                }
            });
        }); };
    }
    ReadMapUseCase.prototype.execute = function (farm_id) {
        return __awaiter(this, void 0, void 0, function () {
            var farm, pivots, pivotArray;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.farmRepository.findById(farm_id)];
                    case 1:
                        farm = _a.sent();
                        return [4 /*yield*/, this.pivotRepository.getAll(farm_id)];
                    case 2:
                        pivots = _a.sent();
                        return [4 /*yield*/, this.handlePivotsResult(pivots)];
                    case 3:
                        pivotArray = _a.sent();
                        return [2 /*return*/, {
                                farm_lat: farm.farm_lat,
                                farm_lng: farm.farm_lng,
                                pivots: pivotArray
                            }];
                }
            });
        });
    };
    ReadMapUseCase = __decorate([
        (0, tsyringe_1.injectable)(),
        __param(0, (0, tsyringe_1.inject)('PivotsRepository')),
        __param(1, (0, tsyringe_1.inject)('FarmsRepository')),
        __param(2, (0, tsyringe_1.inject)('NodesRepository')),
        __param(3, (0, tsyringe_1.inject)('StatesRepository')),
        __metadata("design:paramtypes", [Object, Object, Object, Object])
    ], ReadMapUseCase);
    return ReadMapUseCase;
}());
exports.ReadMapUseCase = ReadMapUseCase;
