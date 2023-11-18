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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestsRouter = void 0;
const express_1 = require("express");
const actions_app_config_schema_1 = require("../schemas/configs/actions.app.config.schema");
const app_config_schema_1 = require("../schemas/configs/app.config.schema");
const gateway_app_config_schema_1 = require("../schemas/configs/gateway.app.config.schema");
const config_utils_1 = require("../utils/config.utils");
const jsonParser_middleware_1 = require("../middlewares/jsonParser.middleware");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const context_middleware_1 = require("../middlewares/context.middleware");
const schemaValidator_middleware_1 = require("../middlewares/schemaValidator.middleware");
const bap_trigger_controller_1 = require("../controllers/bap.trigger.controller");
const bpp_request_controller_1 = require("../controllers/bpp.request.controller");
const unconfigured_controller_1 = require("../controllers/unconfigured.controller");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
exports.requestsRouter = (0, express_1.Router)();
exports.requestsRouter.get("/logs", (req, res) => {
    const files = fs_1.default.readdirSync(path_1.default.join(__dirname + "../../../logs/info"));
    return res.sendFile(path_1.default.join(__dirname + `../../../logs/info/${files[files.length - 1]}`), (err) => {
        if (err) {
            res.json({ success: false, message: err.message });
        }
    });
});
// BAP Client-Side Gateway Configuration.
if ((0, config_utils_1.getConfig)().app.mode === app_config_schema_1.AppMode.bap &&
    (0, config_utils_1.getConfig)().app.gateway.mode === gateway_app_config_schema_1.GatewayMode.client) {
    const requestActions = (0, config_utils_1.getConfig)().app.actions.requests;
    Object.keys(actions_app_config_schema_1.RequestActions).forEach((action) => {
        if (requestActions[action]) {
            // requestsRouter.post(`/${action}`, jsonCompressorMiddleware, contextBuilderMiddleware, authBuilderMiddleware, openApiValidatorMiddleware, bapClientTriggerHandler);
            exports.requestsRouter.post(`/${action}`, jsonParser_middleware_1.jsonCompressorMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, context_middleware_1.contextBuilderMiddleware)(req, res, next, action);
            }), auth_middleware_1.authBuilderMiddleware, schemaValidator_middleware_1.openApiValidatorMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, bap_trigger_controller_1.bapClientTriggerHandler)(req, res, next, action);
            }));
        }
        else {
            exports.requestsRouter.post(`/${action}`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, unconfigured_controller_1.unConfigureActionHandler)(req, res, next, action);
            }));
        }
    });
}
// BPP Network-Side Gateway Configuration.
if ((0, config_utils_1.getConfig)().app.mode == app_config_schema_1.AppMode.bpp &&
    (0, config_utils_1.getConfig)().app.gateway.mode === gateway_app_config_schema_1.GatewayMode.network) {
    const requestActions = (0, config_utils_1.getConfig)().app.actions.requests;
    Object.keys(actions_app_config_schema_1.RequestActions).forEach((action) => {
        if (requestActions[action]) {
            exports.requestsRouter.post(`/${action}`, jsonParser_middleware_1.jsonCompressorMiddleware, auth_middleware_1.authValidatorMiddleware, schemaValidator_middleware_1.openApiValidatorMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, bpp_request_controller_1.bppNetworkRequestHandler)(req, res, next, action);
            }));
        }
        else {
            exports.requestsRouter.post(`/${action}`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, unconfigured_controller_1.unConfigureActionHandler)(req, res, next, action);
            }));
        }
    });
}
