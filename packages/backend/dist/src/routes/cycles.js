"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("../middlewares/auth"));
var GetCycleController_1 = require("../useCases/Cycles/GetCycles/GetCycleController");
var GetLastCyclesController_1 = require("../useCases/Cycles/GetLastCycles/GetLastCyclesController");
var router = express_1.default.Router();
var getLastCycleController = new GetLastCyclesController_1.GetLastCycleController();
var getCycleController = new GetCycleController_1.GetCycleController();
router.get('/:pivot_id', (0, auth_1.default)(), getLastCycleController.handle);
router.get('/:pivot_id/:start/:end', (0, auth_1.default)(), getCycleController.handle);
exports.default = router;
