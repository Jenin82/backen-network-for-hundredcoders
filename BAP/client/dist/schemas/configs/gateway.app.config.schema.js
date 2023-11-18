"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseGatewayAppConfig = exports.gatewayAppConfigSchema = exports.GatewayMode = void 0;
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
var GatewayMode;
(function (GatewayMode) {
    GatewayMode["client"] = "client";
    GatewayMode["network"] = "network";
})(GatewayMode = exports.GatewayMode || (exports.GatewayMode = {}));
exports.gatewayAppConfigSchema = zod_1.z.object({
    mode: zod_1.z.nativeEnum(GatewayMode),
    inboxQueue: zod_1.z.string(),
    outboxQueue: zod_1.z.string(),
    amqpURL: zod_1.z.string(),
});
const parseGatewayAppConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_GatewayAppConfig_NotFound, "Gateway app config not found", 404);
    }
    try {
        return exports.gatewayAppConfigSchema.parse(config);
    }
    catch (e) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_GatewayAppConfig_Invalid, "Invalid gateway app config", 400, e);
    }
};
exports.parseGatewayAppConfig = parseGatewayAppConfig;
