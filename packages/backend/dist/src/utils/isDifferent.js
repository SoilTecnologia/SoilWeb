"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRadioVariableDifferent = exports.isStateVariableDifferent = exports.isStateDifferent = void 0;
var isStateDifferent = function (oldState, newState) {
    if (oldState.connection !== newState.connection ||
        oldState.power !== newState.power ||
        oldState.water !== newState.water ||
        oldState.direction !== newState.direction) {
        console.log('Mudança de estado: ');
        console.log(oldState);
        console.log(newState);
        return true;
    }
    return false;
};
exports.isStateDifferent = isStateDifferent;
var isStateVariableDifferent = function (oldStateVariable, newStateVariable) {
    if (oldStateVariable.angle <= newStateVariable.angle - 5 ||
        oldStateVariable.angle >= newStateVariable.angle + 5 ||
        oldStateVariable.percentimeter <= newStateVariable.percentimeter - 5 ||
        oldStateVariable.percentimeter >= newStateVariable.percentimeter + 5) {
        console.log('atualização de variavel');
        console.log(oldStateVariable);
        console.log(newStateVariable);
        return true;
    }
    return false;
};
exports.isStateVariableDifferent = isStateVariableDifferent;
var isRadioVariableDifferent = function (oldRadioVariable, newRadioVariable) {
    if (oldRadioVariable.father !== newRadioVariable.father ||
        oldRadioVariable.rssi !== newRadioVariable.rssi) {
        return true;
    }
    return false;
};
exports.isRadioVariableDifferent = isRadioVariableDifferent;
