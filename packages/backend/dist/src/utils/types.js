"use strict";
// user_types: tipo a ser testado
Object.defineProperty(exports, "__esModule", { value: true });
exports.isType = void 0;
// target_types: tipos que retornarão true
function isType(user_type, target_types) {
    for (var _i = 0, target_types_1 = target_types; _i < target_types_1.length; _i++) {
        var target = target_types_1[_i];
        if (user_type === target)
            return true;
    }
    return false;
}
exports.isType = isType;
