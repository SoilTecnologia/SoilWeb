"use strict";
// import { iot, mqtt } from 'aws-iot-device-sdk-v2';
// import { container } from 'tsyringe';
// import { TextDecoder } from 'util';
// import { createActionController } from '../controllers/actions';
// import { UpdatePivotStateUseCase } from '../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase';
// import {
//   objectToActionString,
//   statusPayloadStringToObject
// } from '../utils/conversions';
// import emitter from '../utils/eventBus';
// import MessageQueue from '../utils/message_queue';
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
// /*
// Essa classe é responsável por fornecer uma abstração sobre a biblioteca aws-iot-device-sdk-v2.
// Com ela, conseguimos fazer o envio de mensagens para o broker aws-iot-core, e, dependendo de como
// inicializamos sua instância, decidimos como ela deve ser utilizada.
// */
// // A biblioteca pode ser inicializada utilizando algum desses dois types:
// export type IoTDeviceType = 'Raspberry' | 'Cloud';
// class IoTDevice {
//   private type: IoTDeviceType; // Tipo do dispositivo
//   private qos: mqtt.QoS; // Qualidade do serviço
//   private pubTopic?: string = ''; // Tópico de publicação
//   private subTopic: string = ''; // Tópico de subscrição
//   private clientId: string = ''; // Id do cliente (deve ser unico)
//   private connection: mqtt.MqttClientConnection; // A conexão com o broker
//   private ready: boolean = true; // Variavel auxiliar do loop da fila
//   private queue: MessageQueue; // Fila de mensagens à serem enviadas
//   constructor(type: IoTDeviceType, qos: 0 | 1, topic?: string) {
//     this.type = type;
//     this.qos = qos;
//     this.queue = new MessageQueue();
//     if (type === 'Raspberry' && topic) {
//       this.subTopic = `${topic}`;
//       this.pubTopic = `cloud3`;
//       this.clientId = topic;
//     } else {
//       this.subTopic = 'cloud3';
//       this.clientId = 'SPFC';
//     }
//   }
//   /*
//   Nessa função fazemos a inicialização da conexão usando a biblioteca aws-iot-device-sdk-v2.
//   */
//   async start() {
//     const certPath = './src/aws-iot/device.pem.crt';
//     const keyPath = './src/aws-iot/private.pem.key';
//     const endpoint = 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com';
//     try {
//       let configBuilder: iot.AwsIotMqttConnectionConfigBuilder;
//       configBuilder =
//         iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(
//           certPath,
//           keyPath
//         );
//       configBuilder.with_clean_session(false);
//       configBuilder.with_client_id(this.clientId);
//       configBuilder.with_endpoint(endpoint);
//       // configBuilder.with_keep_alive_seconds(10);
//       // configBuilder.with_ping_timeout_ms(1000);
//       const config = configBuilder.build();
//       const client = new mqtt.MqttClient();
//       this.connection = client.new_connection(config);
//       /*
//       Aqui fazemos a conexão com o broker e o subscribe de um tópico dependendo do tipo de dispositivo.
//       */
//       await this.connection.connect();
//       await this.connection.subscribe(
//         this.subTopic,
//         this.qos,
//         this.processMessage
//       );
//       /*
//       Aqui criamos a queue e o loop que irá ficar verificando se há mensagens na fila e enviando para o broker.
//       */
//       await this.setupQueue();
//     } catch (err) {
//       console.log(err);
//     }
//     console.log(`${this.type} connected to AWS IoT Core!`);
//   }
//   /*
//   Função que faz a publicação de mensagens e respostas.
//   A função JSON.stringify() customizada converte o objeto em uma string, além de converter campos especiais como null para string. Isso é importante pois a resposta deve ser exatamente igual ao que o cliente enviou, e campos null normalmente são apagados quando se usa a função JSON.stringify() original.
//  */
//   publish(payload: any, topic?: string) {
//     let finalTopic;
//     if (this.type === 'Cloud') finalTopic = topic;
//     else finalTopic = this.pubTopic;
//     try {
//       const string = JSON.stringify(payload, (k, v) =>
//         v === undefined ? null : v
//       );
//       this.connection.publish(finalTopic!, string, 0, false);
//       console.log(`[IOT] ${finalTopic} Enviando mensagem... ${string}`);
//     } catch (err) {
//       console.log(
//         `Error publishing to topic: ${finalTopic} from ${this.clientId}`,
//         err
//       );
//     }
//   }
//   /*
//   Função que processa as mensagens recebidas do broker.
//   O que acontece apartir disso, depende do tipo do dispositivo e do tipo da mensagem.
//   */
//   processMessage = async (
//     topic: string,
//     message: ArrayBuffer,
//     dup: boolean,
//     qos: mqtt.QoS,
//     retain: boolean
//   ) => {
//     const decoder = new TextDecoder('utf8', { fatal: false });
//     // const filteredMessage = messageToString.substring(0, messageToString.indexOf('}'))
//     const json = JSON.parse(decoder.decode(message));
//     const {
//       type,
//       id,
//       pivot_num,
//       payload
//     }: {
//       type: 'status' | 'action';
//       id: string;
//       pivot_num: number;
//       payload: any;
//     } = json;
//     const updatePivotUseCase = container.resolve(UpdatePivotStateUseCase);
//     const [farm_id, node_num] = id.split('');
//     if (this.type === 'Cloud') {
//       if (json.type === 'status') {
//         const {
//           pivot_id,
//           connection,
//           power,
//           water,
//           direction,
//           angle,
//           percentimeter,
//           timestamp,
//           father,
//           rssi
//         } = json.payload;
//         console.log('TIMESTAMP IOT');
//         console.log(timestamp);
//         await updatePivotUseCase.execute(
//           `${farm_id}_${pivot_num}`,
//           connection,
//           power,
//           water,
//           direction,
//           angle,
//           percentimeter,
//           timestamp,
//           father,
//           rssi
//         );
//         /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
//         this.publish(json, `${farm_id}/${node_num}`);
//         console.log(
//           `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
//         );
//       } else {
//         // GPRS
//         console.log('Received status from GPRS');
//         const statusObject = statusPayloadStringToObject(payload);
//         if (statusObject) {
//           const { power, direction, water, percentimeter, angle, timestamp } =
//             statusObject;
//           await updatePivotUseCase.execute(
//             `${farm_id}_${pivot_num}`, // Como node_num == pivot_num, seria o mesmo que colocar farm_id_pivot_num
//             true,
//             power,
//             water,
//             direction,
//             angle,
//             percentimeter,
//             timestamp,
//             null,
//             null
//           );
//         }
//       }
//     } else if (json.type === 'action') {
//       console.log('[EC2-IOT-ACTION-ACK] Resposta de action recebida');
//       emitter.emit('action-ack-received', json);
//       this.queue.remove(json);
//     } else if (this.type === 'Raspberry') {
//       if (json.type === 'status') {
//         console.log('[RASPBERRY-IOT-STATUS-ACK] Resposta de status recebida');
//         this.queue.remove(json);
//       } else if (json.type === 'action') {
//         const { author, power, water, direction, percentimeter, timestamp } =
//           json.payload;
//         await createActionController(
//           `${farm_id}_${pivot_num}`,
//           author,
//           power,
//           water,
//           direction,
//           percentimeter,
//           new Date(timestamp)
//         );
//         console.log(
//           `[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...`
//         );
//         this.publish(json);
//       }
//     }
//   };
//   /*
//   A função que cria a Queue adiciona listeners que irão receber eventos do banco de dados e adiciona-los a fila de mensagens.
//   OBS: a conversao do timestamp pra string é pra facilitar a comparação no método queue.remove
//   */
//   setupQueue = async () => {
//     if (this.type === 'Raspberry') {
//       emitter.on('status', (status) => {
//         this.queue.enqueue({
//           type: 'status',
//           id: `${status.farm_id}_${status.node_num}`, // TODO status ta vindo node_num?
//           pivot_num: status.node_num,
//           payload: {
//             ...status.payload,
//             timestamp: status.payload.timestamp.toString()
//           },
//           attempts: 0
//         });
//         console.log(
//           `[RASPBERRY-IOT-STATUS] Adicionando mensagem à ser enviada`
//         );
//         this.processQueue();
//       });
//     } else {
//       emitter.on('action', (action) => {
//         if (action.is_gprs) {
//           this.queue.enqueue({
//             type: 'action',
//             id: `${action.farm_id}_${action.node_num}`,
//             payload: objectToActionString(
//               action.payload.power,
//               action.payload.water,
//               action.payload.direction,
//               action.payload.percentimeter
//             ),
//             attempts: 0
//           });
//           console.log(`[EC2-IOT-ACTION] Adicionando mensagem à ser enviada`);
//           this.processQueue();
//         } else {
//           // this.queue.enqueue({
//           //   type: 'action',
//           //   farm_id: action.farm_id,
//           //   node_num: action.node_num,
//           //   pivot_num: action.pivot_num,
//           //   is_gprs: false,
//           //   payload: {
//           //     ...action.payload,
//           //     timestamp: action.payload.timestamp.toString()
//           //   }
//           // });
//         }
//       });
//     }
//   };
//   processQueue = () => {
//     if (this.ready && !this.queue.isEmpty()) {
//       this.ready = false; // Ready serve para parar qualquer outro loop de acessar a queue enquanto acessamos aqui
//       const current = this.queue.peek()!;
//       const [farm_id, node_num] = current.id.split('_');
//       if (current.attempts! < 3) {
//         if (this.type === 'Raspberry') {
//           this.publish(current, this.pubTopic);
//         } else {
//           this.publish(current, `${farm_id}_${node_num}`);
//         }
//         current.attempts!++;
//       } else {
//         console.log('[REMOVING ACTION FROM QUEUE] - Too Many Attempts');
//         emitter.emit('action-ack-not-received', current);
//         this.queue.remove(current);
//         this.ready = true;
//         return;
//       }
//       this.ready = true;
//       setTimeout(() => {
//         this.processQueue();
//       }, 10.0 * 1000);
//     }
//   };
// }
// export default IoTDevice;
var aws_iot_device_sdk_v2_1 = require("aws-iot-device-sdk-v2");
var tsyringe_1 = require("tsyringe");
var util_1 = require("util");
var CreateActionUseCase_1 = require("../useCases/Actions/CreateAction/CreateActionUseCase");
var UpdatePivotStateUseCase_1 = require("../useCases/Pivots/UpdatePivotState/UpdatePivotStateUseCase");
var conversions_1 = require("../utils/conversions");
var eventBus_1 = __importDefault(require("../utils/eventBus"));
var message_queue_1 = __importDefault(require("../utils/message_queue"));
var IoTDevice = /** @class */ (function () {
    function IoTDevice(type, qos, topic) {
        var _this = this;
        this.pubTopic = ''; // Tópico de publicação
        this.subTopic = ''; // Tópico de subscrição
        this.clientId = ''; // Id do cliente (deve ser unico)
        this.ready = true; // Variavel auxiliar do loop da fila
        /*
        Função que processa as mensagens recebidas do broker.
        O que acontece apartir disso, depende do tipo do dispositivo e do tipo da mensagem.
        */
        this.processMessage = function (topic, message, dup, qos, retain) { return __awaiter(_this, void 0, void 0, function () {
            var updatePivotUseCase, createActionUseCase, decoder, json, type, id, pivot_num, payload, _a, farm_id, node_num, pivot_id, connection, power, water, direction, angle, percentimeter, timestamp, father, rssi, statusObject, power, direction, water, percentimeter, angle, timestamp, _b, author, power, water, direction, percentimeter, timestamp, farm_id, node_num, newAction, newTimestamp;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        updatePivotUseCase = tsyringe_1.container.resolve(UpdatePivotStateUseCase_1.UpdatePivotStateUseCase);
                        createActionUseCase = tsyringe_1.container.resolve(CreateActionUseCase_1.CreateActionUseCase);
                        decoder = new util_1.TextDecoder('utf8', { fatal: false });
                        json = JSON.parse(decoder.decode(message));
                        type = json.type, id = json.id, pivot_num = json.pivot_num, payload = json.payload;
                        if (!(this.type === 'Cloud')) return [3 /*break*/, 7];
                        if (!(json.type === 'status')) return [3 /*break*/, 5];
                        _a = id.split('_'), farm_id = _a[0], node_num = _a[1];
                        if (!pivot_num) return [3 /*break*/, 2];
                        pivot_id = payload.pivot_id, connection = payload.connection, power = payload.power, water = payload.water, direction = payload.direction, angle = payload.angle, percentimeter = payload.percentimeter, timestamp = payload.timestamp, father = payload.father, rssi = payload.rssi;
                        return [4 /*yield*/, updatePivotUseCase.execute("".concat(farm_id, "_").concat(node_num), connection, power, water, direction, angle, percentimeter, timestamp, father, rssi)];
                    case 1:
                        _c.sent();
                        /* Assim que recebe o novo status, publica o mesmo payload pra baixo pra avisar que recebeu */
                        this.publish(json, "".concat(farm_id, "/").concat(node_num));
                        console.log("[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...");
                        return [3 /*break*/, 4];
                    case 2:
                        // GPRS
                        console.log('Received status from GPRS');
                        statusObject = (0, conversions_1.statusPayloadStringToObject)(payload);
                        if (!statusObject) return [3 /*break*/, 4];
                        power = statusObject.power, direction = statusObject.direction, water = statusObject.water, percentimeter = statusObject.percentimeter, angle = statusObject.angle, timestamp = statusObject.timestamp;
                        return [4 /*yield*/, updatePivotUseCase.execute("".concat(farm_id, "_").concat(node_num), // Como node_num == pivot_num, seria o mesmo que colocar farm_id_pivot_num
                            true, power, water, direction, angle, percentimeter, timestamp, null, null)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        if (json.type === 'action') {
                            console.log('[EC2-IOT-ACTION-ACK] Resposta de action recebida');
                            eventBus_1.default.emit('action-ack-received', json);
                            this.queue.remove(json);
                        }
                        _c.label = 6;
                    case 6: return [3 /*break*/, 10];
                    case 7:
                        if (!(this.type === 'Raspberry')) return [3 /*break*/, 10];
                        if (!(json.type === 'status')) return [3 /*break*/, 8];
                        console.log('[RASPBERRY-IOT-STATUS-ACK] Resposta de status recebida');
                        this.queue.remove(json);
                        return [3 /*break*/, 10];
                    case 8:
                        if (!(json.type === 'action')) return [3 /*break*/, 10];
                        _b = json.payload, author = _b.author, power = _b.power, water = _b.water, direction = _b.direction, percentimeter = _b.percentimeter, timestamp = _b.timestamp;
                        farm_id = json.farm_id, node_num = json.node_num;
                        newAction = {
                            pivot_id: "".concat(farm_id, "_").concat(node_num),
                            author: author,
                            power: power,
                            water: water,
                            direction: direction,
                            percentimeter: percentimeter
                        };
                        newTimestamp = new Date(timestamp);
                        return [4 /*yield*/, createActionUseCase.execute(newAction, newTimestamp)];
                    case 9:
                        _c.sent();
                        console.log("[EC2-IOT-STATUS-RESPONSE] Enviando ACK de mensagem recebida...");
                        this.publish(json);
                        _c.label = 10;
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        /*
        A função que cria a Queue adiciona listeners que irão receber eventos do banco de dados e adiciona-los a fila de mensagens.
        OBS: a conversao do timestamp pra string é pra facilitar a comparação no método queue.remove
        */
        this.setupQueue = function () { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                if (this.type === 'Raspberry') {
                    eventBus_1.default.on('status', function (status) {
                        _this.queue.enqueue({
                            type: 'status',
                            id: "".concat(status.farm_id, "_").concat(status.node_num),
                            pivot_num: status.node_num,
                            payload: __assign(__assign({}, status.payload), { timestamp: status.payload.timestamp.toString() }),
                            attempts: 0
                        });
                        console.log("[RASPBERRY-IOT-STATUS] Adicionando mensagem \u00E0 ser enviada");
                        _this.processQueue();
                    });
                }
                else {
                    eventBus_1.default.on('action', function (action) {
                        if (action.is_gprs) {
                            _this.queue.enqueue({
                                type: 'action',
                                id: "".concat(action.farm_id, "_").concat(action.node_num),
                                payload: (0, conversions_1.objectToActionString)(action.payload.power, action.payload.water, action.payload.direction, action.payload.percentimeter),
                                attempts: 0
                            });
                            console.log("[EC2-IOT-ACTION] Adicionando mensagem \u00E0 ser enviada");
                            _this.processQueue();
                        }
                        else {
                            // this.queue.enqueue({
                            //   type: 'action',
                            //   farm_id: action.farm_id,
                            //   node_num: action.node_num,
                            //   pivot_num: action.pivot_num,
                            //   is_gprs: false,
                            //   payload: {
                            //     ...action.payload,
                            //     timestamp: action.payload.timestamp.toString()
                            //   }
                            // });
                        }
                    });
                }
                return [2 /*return*/];
            });
        }); };
        this.processQueue = function () {
            if (_this.ready && !_this.queue.isEmpty()) {
                _this.ready = false; // Ready serve para parar qualquer outro loop de acessar a queue enquanto acessamos aqui
                var current = _this.queue.peek();
                var _a = current.id.split('_'), farm_id = _a[0], node_num = _a[1];
                if (current.attempts < 3) {
                    if (_this.type === 'Raspberry') {
                        _this.publish(current, _this.pubTopic);
                    }
                    else {
                        _this.publish(current, "".concat(farm_id, "_").concat(node_num));
                    }
                    current.attempts++;
                }
                else {
                    console.log('[REMOVING ACTION FROM QUEUE] - Too Many Attempts');
                    eventBus_1.default.emit('action-ack-not-received', current);
                    _this.queue.remove(current);
                    _this.ready = true;
                    return;
                }
                _this.ready = true;
                setTimeout(function () {
                    _this.processQueue();
                }, 10.0 * 1000);
            }
        };
        this.type = type;
        this.qos = qos;
        this.queue = new message_queue_1.default();
        if (type === 'Raspberry' && topic) {
            this.subTopic = "".concat(topic);
            this.pubTopic = "cloud3";
            this.clientId = topic;
        }
        else {
            this.subTopic = 'cloud3';
            this.clientId = 'HenriqueDev';
        }
    }
    /*
    Nessa função fazemos a inicialização da conexão usando a biblioteca aws-iot-device-sdk-v2.
    */
    IoTDevice.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var certPath, keyPath, endpoint, configBuilder, config, client, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        certPath = './src/aws-iot/device.pem.crt';
                        keyPath = './src/aws-iot/private.pem.key';
                        endpoint = 'a19mijesri84u2-ats.iot.us-east-1.amazonaws.com';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        configBuilder = void 0;
                        configBuilder =
                            aws_iot_device_sdk_v2_1.iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(certPath, keyPath);
                        configBuilder.with_clean_session(false);
                        configBuilder.with_client_id(this.clientId);
                        configBuilder.with_endpoint(endpoint);
                        config = configBuilder.build();
                        client = new aws_iot_device_sdk_v2_1.mqtt.MqttClient();
                        this.connection = client.new_connection(config);
                        /*
                        Aqui fazemos a conexão com o broker e o subscribe de um tópico dependendo do tipo de dispositivo.
                        */
                        return [4 /*yield*/, this.connection.connect()];
                    case 2:
                        /*
                        Aqui fazemos a conexão com o broker e o subscribe de um tópico dependendo do tipo de dispositivo.
                        */
                        _a.sent();
                        return [4 /*yield*/, this.connection.subscribe(this.subTopic, this.qos, this.processMessage)];
                    case 3:
                        _a.sent();
                        /*
                        Aqui criamos a queue e o loop que irá ficar verificando se há mensagens na fila e enviando para o broker.
                        */
                        return [4 /*yield*/, this.setupQueue()];
                    case 4:
                        /*
                        Aqui criamos a queue e o loop que irá ficar verificando se há mensagens na fila e enviando para o broker.
                        */
                        _a.sent();
                        return [3 /*break*/, 6];
                    case 5:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3 /*break*/, 6];
                    case 6:
                        console.log("".concat(this.type, " connected to AWS IoT Core!"));
                        return [2 /*return*/];
                }
            });
        });
    };
    /*
    Função que faz a publicação de mensagens e respostas.
    A função JSON.stringify() customizada converte o objeto em uma string, além de converter campos especiais como null para string. Isso é importante pois a resposta deve ser exatamente igual ao que o cliente enviou, e campos null normalmente são apagados quando se usa a função JSON.stringify() original.
   */
    IoTDevice.prototype.publish = function (payload, topic) {
        var finalTopic;
        if (this.type === 'Cloud')
            finalTopic = topic;
        else
            finalTopic = this.pubTopic;
        try {
            var string = JSON.stringify(payload, function (k, v) {
                return v === undefined ? null : v;
            });
            this.connection.publish(finalTopic, string, 0, false);
            console.log("[IOT] ".concat(finalTopic, " Enviando mensagem... ").concat(string));
        }
        catch (err) {
            console.log("Error publishing to topic: ".concat(finalTopic, " from ").concat(this.clientId), err);
        }
    };
    return IoTDevice;
}());
exports.default = IoTDevice;
