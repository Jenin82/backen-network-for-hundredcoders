"use strict";
// Create app config schema.
// Create a parser function.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAppConfig = exports.appConfigSchema = exports.AppMode = void 0;
const moment_1 = __importDefault(require("moment"));
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
const actions_app_config_schema_1 = require("./actions.app.config.schema");
const gateway_app_config_schema_1 = require("./gateway.app.config.schema");
var AppMode;
(function (AppMode) {
    AppMode["bap"] = "bap";
    AppMode["bpp"] = "bpp";
})(AppMode = exports.AppMode || (exports.AppMode = {}));
exports.appConfigSchema = zod_1.z.object({
    mode: zod_1.z.nativeEnum(AppMode),
    gateway: gateway_app_config_schema_1.gatewayAppConfigSchema,
    actions: actions_app_config_schema_1.actionsAppConfigSchema,
    privateKey: zod_1.z.string(),
    publicKey: zod_1.z.string(),
    subscriberId: zod_1.z.string(),
    subscriberUri: zod_1.z.string(),
    registryUrl: zod_1.z.string(),
    auth: zod_1.z.boolean(),
    uniqueKey: zod_1.z.string(),
    city: zod_1.z.string(),
    country: zod_1.z.string(),
    ttl: zod_1.z.string().transform((value) => {
        const duration = moment_1.default.duration(value);
        return duration.asMilliseconds();
    }),
    httpTimeout: zod_1.z.string().transform((value) => {
        const duration = moment_1.default.duration(value);
        return duration.asMilliseconds();
    }),
    httpRetryCount: zod_1.z.number(),
});
const parseAppConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_AppConfig_NotFound, "App config not found", 404);
    }
    try {
        const appConfig = exports.appConfigSchema.parse(config);
        return appConfig;
    }
    catch (e) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_AppConfig_Invalid, "Invalid app config", 400, e);
    }
};
exports.parseAppConfig = parseAppConfig;
