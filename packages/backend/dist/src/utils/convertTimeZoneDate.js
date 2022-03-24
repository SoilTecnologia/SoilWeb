"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertData = void 0;
// Set the date to "2018-09-01T16:01:36.386Z"
var date_fns_tz_1 = require("date-fns-tz");
var convertData = function (date) {
    var timeZone = 'America/Sao_Paulo'; // Vamos ver que horas são Lá Embaixo
    var timeInBrisbane = (0, date_fns_tz_1.utcToZonedTime)(date, timeZone);
    return timeInBrisbane;
};
exports.convertData = convertData;
