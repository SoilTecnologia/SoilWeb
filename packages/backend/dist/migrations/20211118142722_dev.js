"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
function up(knex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, knex.schema
                    .createTable('users', function (table) {
                    table
                        .uuid('user_id')
                        .primary()
                        .defaultTo(knex.raw('(uuid_generate_v4())'));
                    table.string('login', 255).unique().notNullable();
                    table.string('password', 255).notNullable();
                    table.enum('user_type', ['SUDO', 'USER']).defaultTo('USER');
                })
                    .createTable('farms', function (table) {
                    table.string('farm_id').unique().primary().notNullable();
                    table.string('farm_name').notNullable();
                    table.string('farm_city').notNullable();
                    table.float('farm_lng').notNullable();
                    table.float('farm_lat').notNullable();
                    table
                        .uuid('user_id')
                        .references('user_id')
                        .inTable('users')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
                    .createTable('nodes', function (table) {
                    table
                        .uuid('node_id')
                        .primary()
                        .defaultTo(knex.raw('(uuid_generate_v4())'));
                    table.integer('node_num').notNullable();
                    table.boolean('is_gprs').notNullable();
                    table.string('gateway');
                    table
                        .string('farm_id')
                        .references('farm_id')
                        .inTable('farms')
                        .index()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
                    .createTable('pivots', function (table) {
                    table.string('pivot_id').unique().primary().notNullable();
                    table.integer('pivot_num').notNullable();
                    table.float('pivot_lng').notNullable();
                    table.float('pivot_lat').notNullable();
                    table.float('pivot_start_angle').notNullable();
                    table.float('pivot_end_angle').notNullable();
                    table.float('pivot_radius').notNullable();
                    table.integer('radio_id').notNullable();
                    table
                        .uuid('node_id')
                        .references('node_id')
                        .inTable('nodes')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                    table
                        .string('farm_id')
                        .references('farm_id')
                        .inTable('farms')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
                    .createTable('states', function (table) {
                    table
                        .uuid('state_id')
                        .primary()
                        .defaultTo(knex.raw('(uuid_generate_v4())'));
                    table.boolean('power');
                    table.boolean('water');
                    table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']);
                    table.boolean('connection').notNullable();
                    table.datetime('timestamp').notNullable();
                    table
                        .string('pivot_id')
                        .references('pivot_id')
                        .inTable('pivots')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
                    .createTable('state_variables', function (table) {
                    table
                        .uuid('state_variable_id')
                        .primary()
                        .defaultTo(knex.raw('(uuid_generate_v4())'));
                    table.float('angle');
                    table.float('percentimeter');
                    table.datetime('timestamp').notNullable();
                    table
                        .uuid('state_id')
                        .references('state_id')
                        .inTable('states')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
                    .createTable('radio_variables', function (table) {
                    table
                        .uuid('radio_variable_id')
                        .primary()
                        .defaultTo(knex.raw('(uuid_generate_v4())'));
                    table.string('father');
                    table.float('rssi');
                    table.datetime('timestamp').notNullable();
                    table
                        .string('pivot_id')
                        .references('pivot_id')
                        .inTable('pivots')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                    table
                        .uuid('state_id')
                        .references('state_id')
                        .inTable('states')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })
                    .createTable('actions', function (table) {
                    table
                        .uuid('action_id')
                        .primary()
                        .defaultTo(knex.raw('(uuid_generate_v4())'));
                    table.boolean('power').notNullable();
                    table.boolean('water');
                    table.enum('direction', ['CLOCKWISE', 'ANTI_CLOCKWISE']);
                    table.float('percentimeter');
                    table.boolean('success').defaultTo(null);
                    table.datetime('timestamp_sent').notNullable();
                    table.datetime('timestamp_success');
                    table
                        .uuid('author')
                        .references('user_id')
                        .inTable('users')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                    table
                        .string('pivot_id')
                        .references('pivot_id')
                        .inTable('pivots')
                        .index()
                        .notNullable()
                        .onUpdate('CASCADE')
                        .onDelete('CASCADE');
                })];
        });
    });
}
exports.up = up;
function down(knex) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, knex.schema
                    .alterTable('actions', function (table) {
                    table.dropPrimary();
                    table.dropForeign('author');
                    table.dropForeign('pivot_id');
                })
                    .alterTable('radio_variables', function (table) {
                    table.dropPrimary();
                    table.dropForeign('state_id');
                    table.dropForeign('pivot_id');
                })
                    .alterTable('state_variables', function (table) {
                    table.dropPrimary();
                    table.dropForeign('state_id');
                })
                    .alterTable('states', function (table) {
                    table.dropPrimary();
                    table.dropForeign('pivot_id');
                })
                    .alterTable('pivots', function (table) {
                    table.dropPrimary();
                    table.dropForeign('node_id');
                })
                    .alterTable('nodes', function (table) {
                    table.dropPrimary();
                    table.dropForeign('farm_id');
                })
                    .alterTable('farms', function (table) {
                    table.dropPrimary();
                    table.dropForeign('user_id');
                })
                    .alterTable('users', function (table) {
                    table.dropPrimary();
                })
                    .dropTable('actions')
                    .dropTable('radio_variables')
                    .dropTable('states')
                    .dropTable('state_variables')
                    .dropTable('pivots')
                    .dropTable('nodes')
                    .dropTable('farms')
                    .dropTable('users')];
        });
    });
}
exports.down = down;
