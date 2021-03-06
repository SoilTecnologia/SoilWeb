"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tsyringe_1 = require("tsyringe");
var ActionRepository_1 = require("../../database/repositories/Action/ActionRepository");
var FarmsRepository_1 = require("../../database/repositories/Farms/FarmsRepository");
var NodesRepository_1 = require("../../database/repositories/Nodes/NodesRepository");
var PivotsRepository_1 = require("../../database/repositories/Pivots/PivotsRepository");
var RadioVariablesRepository_1 = require("../../database/repositories/RadioVariables/RadioVariablesRepository");
var StatesRepository_1 = require("../../database/repositories/States/StatesRepository");
var StatesVariablesRepository_1 = require("../../database/repositories/StatesVariables/StatesVariablesRepository");
var UserRepository_1 = require("../../database/repositories/Users/UserRepository");
tsyringe_1.container.registerSingleton('UsersRepository', (0, tsyringe_1.delay)(function () { return UserRepository_1.UsersRepository; }));
tsyringe_1.container.registerSingleton('FarmsRepository', (0, tsyringe_1.delay)(function () { return FarmsRepository_1.FarmsRepository; }));
tsyringe_1.container.registerSingleton('PivotsRepository', (0, tsyringe_1.delay)(function () { return PivotsRepository_1.PivotsRepository; }));
tsyringe_1.container.registerSingleton('NodesRepository', (0, tsyringe_1.delay)(function () { return NodesRepository_1.NodesRepository; }));
tsyringe_1.container.registerSingleton('StatesRepository', (0, tsyringe_1.delay)(function () { return StatesRepository_1.StatesRepository; }));
tsyringe_1.container.registerSingleton('StatesVariablesRepository', (0, tsyringe_1.delay)(function () { return StatesVariablesRepository_1.StatesVariablesRepository; }));
tsyringe_1.container.registerSingleton('RadioVariablesRepository', (0, tsyringe_1.delay)(function () { return RadioVariablesRepository_1.RadioVariableRepository; }));
tsyringe_1.container.registerSingleton('ActionsRepository', (0, tsyringe_1.delay)(function () { return ActionRepository_1.ActionRepository; }));
