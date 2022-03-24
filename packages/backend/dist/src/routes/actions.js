"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("../middlewares/auth"));
var CreateActionController_1 = require("../useCases/Actions/CreateAction/CreateActionController");
var GetAllActionsController_1 = require("../useCases/Actions/GetAllActions/GetAllActionsController");
var router = express_1.default.Router();
var getAllActionController = new GetAllActionsController_1.GetAllActionsController();
var createActionController = new CreateActionController_1.CreateActionController();
router.post('/create/:pivot_id', (0, auth_1.default)(), createActionController.handle);
router.get('/read', getAllActionController.handle);
exports.default = router;
