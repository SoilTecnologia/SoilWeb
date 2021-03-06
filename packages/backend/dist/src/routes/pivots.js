"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("../middlewares/auth"));
var CreatePivotController_1 = require("../useCases/Pivots/CreatePivots/CreatePivotController");
var DeletePivotController_1 = require("../useCases/Pivots/DeletePivot/DeletePivotController");
var FindAllController_1 = require("../useCases/Pivots/FindAll/FindAllController");
var GetAllPivotsController_1 = require("../useCases/Pivots/GetAllPivots/GetAllPivotsController");
var GetOnePivotController_1 = require("../useCases/Pivots/GetOnePivot/GetOnePivotController");
var ReadAllController_1 = require("../useCases/Pivots/ReadAll/ReadAllController");
var ReadListController_1 = require("../useCases/Pivots/ReadList/ReadListController");
var ReadMapController_1 = require("../useCases/Pivots/ReadMap/ReadMapController");
var ReadPivotController_1 = require("../useCases/Pivots/ReadPivotState/ReadPivotController");
var UpdatePivotController_1 = require("../useCases/Pivots/UpdatePivot/UpdatePivotController");
var UpdatePivotStateController_1 = require("../useCases/Pivots/UpdatePivotState/UpdatePivotStateController");
var router = express_1.default.Router();
var createPivotController = new CreatePivotController_1.CreatePivotController();
var getAllPivotsController = new GetAllPivotsController_1.GetAllPivotsController();
var getOnePivotController = new GetOnePivotController_1.GetOnePivotController();
var deletePivotController = new DeletePivotController_1.DeletePivotController();
var updatePivotController = new UpdatePivotController_1.UpdatePivotController();
var readAllController = new ReadAllController_1.ReadAllController();
var readMapController = new ReadMapController_1.ReadMapController();
var readListPivotController = new ReadListController_1.ReadListController();
var readPivotStateController = new ReadPivotController_1.ReadPivotStateController();
var updatePivotStateController = new UpdatePivotStateController_1.UpdateStatePivotController();
var findAllController = new FindAllController_1.FindAllController();
router.get('/readAll/:farm_id', (0, auth_1.default)(), readAllController.handle);
router.get('/map/:farm_id', (0, auth_1.default)(), readMapController.handle);
router.get('/state/:pivot_id', (0, auth_1.default)(), readPivotStateController.handle);
router.get('/list/:farm_id', (0, auth_1.default)(), readListPivotController.handle);
router.get('/findAll', (0, auth_1.default)(), findAllController.handle);
router.post('/update/:pivot_id', (0, auth_1.default)(), updatePivotStateController.handle);
// Admin
router.get('/getPivots/:id', (0, auth_1.default)(), getAllPivotsController.handle);
router.get('/getOnePivot/:pivot_num/:farm_id', (0, auth_1.default)(), getOnePivotController.handle);
router.post('/addPivot', (0, auth_1.default)(), createPivotController.handle);
router.delete('/deletePivot/:id', (0, auth_1.default)(), deletePivotController.handle);
router.put('/putPivot', (0, auth_1.default)(), updatePivotController.handle);
exports.default = router;
