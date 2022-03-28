"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decimalArrayToASCII = exports.objectToActionPayloadString = exports.statusPayloadStringToObject = exports.objectToActionString = exports.statusStringToObject = void 0;
var statusStringToObject = function (status) {
    var _a = /(\d{1})-(\d{1})-(\d{1})-(\d+)-(\d+)-(\d+)/.exec("".concat(status)) || [], match = _a[0], direction = _a[1], water = _a[2], power = _a[3], percentimeter = _a[4], angle = _a[5], timestamp = _a[6];
    var response = {
        power: null,
        direction: null,
        water: null,
        percentimeter: 0,
        angle: 0,
        timestamp: new Date()
    };
    if (match) {
        if (direction === '3') {
            response.direction = 'CLOCKWISE';
        }
        else if (direction === '4') {
            response.direction = 'ANTI_CLOCKWISE';
        }
        if (water === '5') {
            response.water = false;
        }
        else if (water === '6') {
            response.water = true;
        }
        if (power == '1') {
            response.power = true;
        }
        else if (power == '2') {
            response.power = false;
        }
        response.percentimeter = Number(percentimeter);
        response.angle = Number(angle);
        response.timestamp = new Date(Number(timestamp));
        return response;
    }
    return null;
};
exports.statusStringToObject = statusStringToObject;
var objectToActionString = function (power, water, direction, percentimeter) {
    var actionString = '';
    if (power) {
        if (direction == 'CLOCKWISE')
            actionString += '3';
        else if (direction == 'ANTI_CLOCKWISE')
            actionString += '4';
        if (water)
            actionString += '6';
        else
            actionString += '5';
        actionString += '1';
        actionString += '-';
        actionString += percentimeter.toString().padStart(3, '0');
    }
    else {
        return '00200';
    }
    return actionString;
};
exports.objectToActionString = objectToActionString;
var statusPayloadStringToObject = function (payload) {
    var _a = /(\d{1})(\d{1})(\d{1})-(\d+)-(\d+)-(\d+)/.exec("".concat(payload)) || [], match = _a[0], direction = _a[1], water = _a[2], power = _a[3], percentimeter = _a[4], angle = _a[5], timestamp = _a[6];
    var response = {
        power: null,
        direction: null,
        water: null,
        percentimeter: 0,
        angle: 0,
        timestamp: new Date()
    };
    if (match) {
        if (direction == '3') {
            response.direction = 'CLOCKWISE';
        }
        else if (direction == '4') {
            response.direction = 'ANTI_CLOCKWISE';
        }
        if (water == '5') {
            response.water = false;
        }
        else if (water == '6') {
            response.water = true;
        }
        if (power == '1') {
            response.power = true;
        }
        else if (power == '2') {
            response.power = false;
        }
        response.percentimeter = Number(percentimeter);
        response.angle = Number(angle);
        response.timestamp = new Date(Number(timestamp) * 1000);
        return response;
    }
    return null;
};
exports.statusPayloadStringToObject = statusPayloadStringToObject;
var objectToActionPayloadString = function (power, water, direction, percentimeter) {
    var actionString = '';
    if (power) {
        if (direction == 'CLOCKWISE')
            actionString += '3';
        else if (direction == 'ANTI_CLOCKWISE')
            actionString += '4';
        if (water)
            actionString += '6';
        else
            actionString += '5';
        actionString += '1';
        actionString += percentimeter.toString().padStart(3, '0');
    }
    else {
        return '00200';
    }
    return actionString;
};
exports.objectToActionPayloadString = objectToActionPayloadString;
var decimalArrayToASCII = function (decArray) { };
exports.decimalArrayToASCII = decimalArrayToASCII;
