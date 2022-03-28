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
exports.start = exports.loadPivots = exports.loadActions = void 0;
var axios_1 = __importDefault(require("axios"));
var form_data_encoder_1 = require("form-data-encoder");
var formdata_node_1 = require("formdata-node");
var stream_1 = require("stream");
var tsyringe_1 = require("tsyringe");
var PivotsRepository_1 = require("../database/repositories/Pivots/PivotsRepository");
var GetAllActionUseCase_1 = require("../useCases/Actions/GetAllActions/GetAllActionUseCase");
var UpdateActionUseCase_1 = require("../useCases/Actions/UpdateActionUseCase");
var UpdatePivotStateUseCase_1 = require("../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase");
var conversions_1 = require("../utils/conversions");
var eventBus_1 = __importDefault(require("../utils/eventBus"));
var generic_queue_1 = __importDefault(require("../utils/generic_queue"));
var TIMEOUT = 10000;
var activeQueue = new generic_queue_1.default(); // Guarda as intenções 351..., vao participar da pool que atualiza mais rapido
var idleQueue = new generic_queue_1.default(); // Guarda as intenções 00000, vao participar da pool que atualiza de forma mais devagar
var ready = true;
var sendData = function (radio_id, data) { return __awaiter(void 0, void 0, void 0, function () {
    var bodyFormData, encoder, response;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bodyFormData = new formdata_node_1.FormData();
                bodyFormData.set('ID', radio_id);
                // bodyFormData.set('CMD', '40');
                bodyFormData.set('intencao', data);
                encoder = new form_data_encoder_1.FormDataEncoder(bodyFormData);
                return [4 /*yield*/, axios_1.default.post('http://192.168.100.101:3031/comands', stream_1.Readable.from(encoder), { headers: encoder.headers, timeout: TIMEOUT })];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response];
        }
    });
}); };
var checkResponse = function (action, payload) {
    if (payload) {
        if (action.power) {
            // Se nossa intenção era ligar, checamos todo o payload
            if (payload.power == action.power &&
                payload.water == action.water &&
                payload.direction == action.direction)
                return true;
        }
        else {
            // Caso contrário checamos apenas se o estado do pivo e da bomba, sem levar em conta a direction
            if (payload.power == action.power && payload.water == action.water)
                return true;
        }
    }
    return false;
};
var loadActions = function () { return __awaiter(void 0, void 0, void 0, function () {
    var readPivots, allActions, _i, allActions_1, action;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                readPivots = tsyringe_1.container.resolve(GetAllActionUseCase_1.GetAllActionsUseCase);
                return [4 /*yield*/, readPivots.execute()];
            case 1:
                allActions = _a.sent();
                for (_i = 0, allActions_1 = allActions; _i < allActions_1.length; _i++) {
                    action = allActions_1[_i];
                    activeQueue.enqueue({ action: action, attempts: 0, timestamp: new Date() });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.loadActions = loadActions;
var loadPivots = function () { return __awaiter(void 0, void 0, void 0, function () {
    var getAllPivots, allPivots, _i, allPivots_1, pivot;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                getAllPivots = new PivotsRepository_1.PivotsRepository();
                return [4 /*yield*/, getAllPivots.findAll()];
            case 1:
                allPivots = _a.sent();
                for (_i = 0, allPivots_1 = allPivots; _i < allPivots_1.length; _i++) {
                    pivot = allPivots_1[_i];
                    idleQueue.enqueue({
                        pivot_id: pivot.pivot_id,
                        radio_id: pivot.radio_id,
                        attempts: 0
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.loadPivots = loadPivots;
var checkPool = function () { return __awaiter(void 0, void 0, void 0, function () {
    var getUpdatePivotController, updateActionUseCase, current, _a, power, water, direction, percentimeter, actionString, response, data, payload, payloadToString, payloadObject, err_1, removed, current, response, data, payload, payloadToString, payloadObject, err_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                getUpdatePivotController = tsyringe_1.container.resolve(UpdatePivotStateUseCase_1.UpdatePivotStateUseCase);
                updateActionUseCase = tsyringe_1.container.resolve(UpdateActionUseCase_1.UpdateActionsUseCase);
                ready = false;
                if (!!activeQueue.isEmpty()) return [3 /*break*/, 13];
                console.log('CHECKING ACTIVE');
                current = activeQueue.peek();
                _b.label = 1;
            case 1:
                _b.trys.push([1, 7, 8, 12]);
                _a = current.action, power = _a.power, water = _a.water, direction = _a.direction, percentimeter = _a.percentimeter;
                actionString = (0, conversions_1.objectToActionString)(power, water, direction, percentimeter);
                console.log("Sending Action to radio ".concat(current.action.radio_id, ": ").concat(actionString));
                return [4 /*yield*/, sendData(current.action.radio_id, actionString)];
            case 2:
                response = _b.sent();
                data = response.data;
                payload = data.payload;
                payloadToString = new TextDecoder().decode(new Uint8Array(payload));
                payloadObject = (0, conversions_1.statusStringToObject)(payloadToString.substring(0, payloadToString.indexOf('#')));
                if (!(payloadObject &&
                    current.action.radio_id == data.id &&
                    checkResponse(current.action, payloadObject))) return [3 /*break*/, 5];
                return [4 /*yield*/, getUpdatePivotController.execute(current.action.pivot_id, true, payloadObject.power, payloadObject.water, payloadObject.direction, payloadObject.angle, payloadObject.percentimeter, payloadObject.timestamp, '', null)];
            case 3:
                _b.sent();
                current.attempts = 0;
                console.log('UPDATING ACTION:', current.action.action_id);
                return [4 /*yield*/, updateActionUseCase.execute(current.action.action_id, true)];
            case 4:
                _b.sent();
                activeQueue.dequeue();
                return [3 /*break*/, 6];
            case 5:
                current.attempts++;
                _b.label = 6;
            case 6: return [3 /*break*/, 12];
            case 7:
                err_1 = _b.sent();
                current.attempts++;
                console.log("[ERROR - RASPBERRY.TEST]: ".concat(err_1));
                return [3 /*break*/, 12];
            case 8:
                if (!(current.attempts > 4)) return [3 /*break*/, 11];
                console.log('Failing PIVOT');
                return [4 /*yield*/, getUpdatePivotController.execute(current.action.pivot_id, false, null, null, null, null, null, new Date(), null, null)];
            case 9:
                _b.sent();
                removed = activeQueue.dequeue();
                return [4 /*yield*/, updateActionUseCase.execute(removed.action.action_id, false)];
            case 10:
                _b.sent();
                _b.label = 11;
            case 11: return [7 /*endfinally*/];
            case 12: return [3 /*break*/, 23];
            case 13:
                if (!!idleQueue.isEmpty()) return [3 /*break*/, 23];
                current = idleQueue.peek();
                console.log('CHECKING IDLE');
                _b.label = 14;
            case 14:
                _b.trys.push([14, 19, 20, 23]);
                console.log("Checking radio ".concat(current.radio_id));
                return [4 /*yield*/, sendData(current.radio_id, '000000')];
            case 15:
                response = _b.sent();
                data = response.data;
                payload = data.payload;
                payloadToString = new TextDecoder().decode(new Uint8Array(payload));
                payloadObject = (0, conversions_1.statusStringToObject)(payloadToString.substring(0, payloadToString.indexOf('#')));
                if (!(payloadObject && current.radio_id == data.id)) return [3 /*break*/, 17];
                return [4 /*yield*/, getUpdatePivotController.execute(current.pivot_id, true, payloadObject.power, payloadObject.water, payloadObject.direction, payloadObject.angle, payloadObject.percentimeter, new Date(), null, null)];
            case 16:
                _b.sent();
                current.attempts = 0;
                return [3 /*break*/, 18];
            case 17:
                current.attempts++;
                _b.label = 18;
            case 18: return [3 /*break*/, 23];
            case 19:
                err_2 = _b.sent();
                console.log("[ERROR]: ".concat(err_2));
                current.attempts++;
                return [3 /*break*/, 23];
            case 20:
                if (!(current.attempts >= 10)) return [3 /*break*/, 22];
                console.log('Failing PIVOT');
                return [4 /*yield*/, getUpdatePivotController.execute(current.pivot_id, false, null, null, null, null, null, new Date(), null, null)];
            case 21:
                _b.sent();
                _b.label = 22;
            case 22:
                current = idleQueue.dequeue();
                idleQueue.enqueue(current);
                return [7 /*endfinally*/];
            case 23:
                ready = true;
                return [2 /*return*/];
        }
    });
}); };
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        (0, exports.loadActions)();
        (0, exports.loadPivots)();
        eventBus_1.default.on('action', function (action) {
            activeQueue.enqueue({
                action: action.payload,
                timestamp: new Date(),
                attempts: 0
            });
        });
        // Seta um intervalo para ficar checando a pool
        // Dentro da checkPool existe uma flag ready para ver se ja posso checar o proximo
        setInterval(function () {
            if (ready)
                checkPool();
        }, 5000);
        return [2 /*return*/];
    });
}); };
exports.start = start;
/*
Checa se a resposta da placa é igual à uma action que mandamos à ela
*/
// Sends data to radio
// Returns the response
// The payload is a array of Decimal numbers, needs to be converted
// const checkPool = async () => {
//   ready = false;
//   if (fatherCounter < fatherUpdate) {
//     // console.log(
//     //   'Check Pool: ',
//     //   'IDLE: ',
//     //   idlePool.length,
//     //   ' ACTIVE: ',
//     //   activePool.length
//     // );
//     for (let activeIntent of activePool) {
//       console.log(
//         '[ACTIVE]\tSending data to pivot',
//         activeIntent.intent.radio_name
//       );
//       try {
//         const result = await sendData(activeIntent);
//         const { response, response_time } = result;
//         if (
//           response.status == 200 &&
//           response.data.id == activeIntent.intent.radio_name
//         ) {
//           activePool = activePool.filter((value) => value != activeIntent);
//           activeIntent.timestamp = new Date();
//           activeIntent.attempts = 0;
//           idlePool.push(activeIntent);
//           processResponse(
//             activeIntent.intent.radio_name,
//             activeIntent.intent,
//             response.data,
//             response_time
//           );
//         } else {
//           console.log(
//             `[ERROR]\tResposta de outro id: -> ${activeIntent.intent.radio_name} | -> ${response.data.id}`
//           );
//           activeIntent.attempts++;
//           if (activeIntent.attempts >= 5) {
//             await updatePivotController(
//               activeIntent.intent.radio_name,
//               'OFFLINE'
//             );
//             activeIntent.attempts = 0;
//           }
//         }
//       } catch (err) {
//         console.log('[TIMEOUT]\ton', activeIntent.intent.radio_name);
//         activeIntent.attempts++;
//         activePool = activePool.filter((value) => value != activeIntent);
//         activeIntent.timestamp = new Date();
//         idlePool.push(activeIntent);
//         if (activeIntent.attempts >= 5) {
//           await updatePivotController(
//             activeIntent.intent.radio_name,
//             'OFFLINE'
//           );
//           activeIntent.attempts = 0;
//         }
//       }
//     }
//     for (let idleIntent of idlePool) {
//       if (
//         new Date().getTime() - new Date(idleIntent.timestamp).getTime() >=
//         8000
//       ) {
//         console.log(
//           '[IDLE]\tSending data to pivot',
//           idleIntent.intent.radio_name
//         );
//         try {
//           const result = await sendData(idleIntent);
//           const { response, response_time } = result;
//           if (
//             response.status == 200 &&
//             response.data.id == idleIntent.intent.radio_name
//           ) {
//             idleIntent.timestamp = new Date();
//             idleIntent.attempts = 0;
//             processResponse(
//               idleIntent.intent.radio_name,
//               idleIntent.intent,
//               response.data,
//               response_time
//             );
//           } else {
//             console.log(
//               `[ERROR]\tResposta de outro id: -> ${idleIntent.intent.radio_name} | -> ${response.data.id}`
//             );
//             idleIntent.attempts++;
//             if (idleIntent.attempts >= 5) {
//               await updatePivotController(
//                 idleIntent.intent.radio_name,
//                 'OFFLINE'
//               );
//               idleIntent.attempts = 0;
//             }
//           }
//         } catch (err) {
//           idleIntent.attempts++;
//           console.log('[TIMEOUT]\ton', idleIntent.intent.radio_name);
//           if (idleIntent.attempts >= 5) {
//             await updatePivotController(
//               idleIntent.intent.radio_name,
//               'OFFLINE'
//             );
//             idleIntent.attempts = 0;
//           }
//         }
//       }
//     }
//   } else {
//     fatherCounter = 0;
//   }
//   fatherCounter++;
//   ready = true;
// };
