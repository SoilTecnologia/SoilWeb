"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// import raspberryRoute from './raspberry';
var errors_1 = require("../types/errors");
var actions_1 = __importDefault(require("./actions"));
var cycles_1 = __importDefault(require("./cycles"));
var farms_1 = __importDefault(require("./farms"));
var nodes_1 = __importDefault(require("./nodes"));
var pivots_1 = __importDefault(require("./pivots"));
var users_1 = __importDefault(require("./users"));
var router = express_1.default.Router();
/*
  This functions is a error middleware
  This means that whenever a error is thrown inside a route, express catches the error and calls this function.

  When this function is called we end the request-response cycle sending a error message with Status 500.

  see: https://github.com/expressjs/express/blob/master/examples/error/index.js
*/
function error(err, req, res, next) {
    console.log(err);
    if (err instanceof errors_1.ServerError)
        res.status(400).send(err.message);
    else if (err instanceof Error)
        res.status(500).send(err.message);
    else
        res.status(500).send('Internal Server Error');
    next();
}
router.use('/users', users_1.default);
router.use('/farms', farms_1.default);
router.use('/pivots', pivots_1.default);
router.use('/nodes', nodes_1.default);
router.use('/actions', actions_1.default);
router.use('/cycles', cycles_1.default);
router.use('/api-status', function (req, res, next) {
    res.sendStatus(200);
});
// router.use('/radio', radioRoute);
// router.use('/intent', intentRoute);
// // router.use('/raspberry', raspberryRoute);
// router.use('/test', testRoute);
router.use(error);
exports.default = router;
