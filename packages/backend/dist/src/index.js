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
/* eslint-disable camelcase */
/*
This is the entry point of the application,
this file is responsible for:
  - Setting up the Express Server
  - Setting up AWS IoT Core (depending on the deployment RASP/CLOUD)
  - Setting up the event emitter to be used on other systems
*/
var cors_1 = __importDefault(require("cors"));
var express_1 = __importDefault(require("express"));
var http_1 = require("http");
require("reflect-metadata");
var socket_io_1 = require("socket.io");
var index_1 = __importDefault(require("./aws-iot/index"));
var FarmsRepository_1 = require("./database/repositories/Farms/FarmsRepository");
var routes_1 = __importDefault(require("./routes"));
require("./shared/container");
var eventBus_1 = __importDefault(require("./utils/eventBus"));
require('dotenv').config();
var PORT = 3308;
var app = (0, express_1.default)();
var httpServer = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(httpServer);
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
httpServer.listen(PORT, function () {
    console.info("Server Listening on PORT ".concat(PORT));
});
io.on('connection', function (socket) {
    eventBus_1.default.on('state-change', function (status) {
        var user_id = status.user_id, pivot_num = status.pivot_num, farm_name = status.farm_name, pivot_id = status.pivot_id, connection = status.connection, power = status.power, water = status.water, direction = status.direction, percentimeter = status.percentimeter;
        socket.emit("".concat(user_id, "-status"), {
            type: 'status',
            pivot_id: pivot_id,
            pivot_num: pivot_num,
            farm_name: farm_name,
            power: power,
            water: water,
            direction: direction,
            connection: connection,
            percentimeter: percentimeter
        });
        // console.log(`socket de state: `, status);
    });
    eventBus_1.default.on('variable-change', function (status) {
        var user_id = status.user_id, pivot_id = status.pivot_id, angle = status.angle, percentimeter = status.percentimeter;
        socket.emit("".concat(user_id, "-status"), {
            type: 'variable',
            pivot_id: pivot_id,
            angle: angle,
            percentimeter: percentimeter
        });
        // console.log(`socket de variavel: `, status);
    });
    eventBus_1.default.on('action-ack-received', function (action) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, farm_id, pivot_num, farmRepository, farm, _b, user_id, farm_name;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = action.id;
                    _a = id.split('_'), farm_id = _a[0], pivot_num = _a[1];
                    farmRepository = new FarmsRepository_1.FarmsRepository();
                    return [4 /*yield*/, farmRepository.findById(farm_id)];
                case 1:
                    farm = _c.sent();
                    _b = farm, user_id = _b.user_id, farm_name = _b.farm_name;
                    socket.emit("".concat(user_id, "-ackreceived"), {
                        type: 'ack',
                        pivot_num: pivot_num,
                        farm_name: farm_name
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    eventBus_1.default.on('action-ack-not-received', function (action) { return __awaiter(void 0, void 0, void 0, function () {
        var id, _a, farm_id, pivot_num, farmRepository, farm, _b, user_id, farm_name;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    id = action.id;
                    _a = id.split('_'), farm_id = _a[0], pivot_num = _a[1];
                    farmRepository = new FarmsRepository_1.FarmsRepository();
                    return [4 /*yield*/, farmRepository.findById(farm_id)];
                case 1:
                    farm = _c.sent();
                    _b = farm, user_id = _b.user_id, farm_name = _b.farm_name;
                    socket.emit("".concat(user_id, "-acknotreceived"), {
                        type: 'ack',
                        pivot_num: pivot_num,
                        farm_name: farm_name
                    });
                    return [2 /*return*/];
            }
        });
    }); });
});
// raspberry.start();
var iotDevice = new index_1.default('Cloud', 0);
// const iotDevice = new IoTDevice(
//   'Raspberry',
//   0,
//   'e5ce95e1-277d-40a7-b843-6d2cb51d1e8f/0'
// );
iotDevice.start();
// e5ce95e1-277d-40a7-b843-6d2cb51d1e8f
// cae38681-5734-4629-b564-31764fef9b97/1
