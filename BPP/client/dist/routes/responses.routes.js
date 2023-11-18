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
exports.responsesRouter = void 0;
const express_1 = require("express");
const bap_response_controller_1 = require("../controllers/bap.response.controller");
const bpp_response_controller_1 = require("../controllers/bpp.response.controller");
const unconfigured_controller_1 = require("../controllers/unconfigured.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const context_middleware_1 = require("../middlewares/context.middleware");
const jsonParser_middleware_1 = require("../middlewares/jsonParser.middleware");
const schemaValidator_middleware_1 = require("../middlewares/schemaValidator.middleware");
const actions_app_config_schema_1 = require("../schemas/configs/actions.app.config.schema");
const app_config_schema_1 = require("../schemas/configs/app.config.schema");
const gateway_app_config_schema_1 = require("../schemas/configs/gateway.app.config.schema");
const config_utils_1 = require("../utils/config.utils");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
exports.responsesRouter = (0, express_1.Router)();
// BAP Network-Side Gateway Configuration.
if ((0, config_utils_1.getConfig)().app.mode === app_config_schema_1.AppMode.bap &&
    (0, config_utils_1.getConfig)().app.gateway.mode === gateway_app_config_schema_1.GatewayMode.network) {
    const responseActions = (0, config_utils_1.getConfig)().app.actions.responses;
    Object.keys(actions_app_config_schema_1.ResponseActions).forEach((action) => {
        if (responseActions[action]) {
            exports.responsesRouter.post(`/${action}`, jsonParser_middleware_1.jsonCompressorMiddleware, auth_middleware_1.authValidatorMiddleware, schemaValidator_middleware_1.openApiValidatorMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                logger_utils_1.default.info(`response from bpp: ${JSON.stringify(req.body)}`);
                yield (0, bap_response_controller_1.bapNetworkResponseHandler)(req, res, next, action);
            }));
        }
        else {
            exports.responsesRouter.post(`/${action}`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, unconfigured_controller_1.unConfigureActionHandler)(req, res, next, action);
            }));
        }
    });
}
// BPP Client-Side Gateway Configuration.
if ((0, config_utils_1.getConfig)().app.mode === app_config_schema_1.AppMode.bpp &&
    (0, config_utils_1.getConfig)().app.gateway.mode === gateway_app_config_schema_1.GatewayMode.client) {
    const responseActions = (0, config_utils_1.getConfig)().app.actions.responses;
    Object.keys(actions_app_config_schema_1.ResponseActions).forEach((action) => {
        if (responseActions[action]) {
            exports.responsesRouter.post(`/${action}`, jsonParser_middleware_1.jsonCompressorMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, context_middleware_1.contextBuilderMiddleware)(req, res, next, action);
            }), auth_middleware_1.authBuilderMiddleware, schemaValidator_middleware_1.openApiValidatorMiddleware, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, bpp_response_controller_1.bppClientResponseHandler)(req, res, next, action);
            }));
        }
        else {
            exports.responsesRouter.post(`/${action}`, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, unconfigured_controller_1.unConfigureActionHandler)(req, res, next, action);
            }));
        }
    });
}
