"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseServerConfig = exports.serverConfigSchema = void 0;
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
exports.serverConfigSchema = zod_1.z.object({
    port: zod_1.z.number(),
});
const parseServerConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ServerConfig_NotFound, "Server config not found", 404);
    }
    try {
        return exports.serverConfigSchema.parse(config);
    }
    catch (e) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ServerConfig_Invalid, "Invalid server config", 400, e);
    }
};
exports.parseServerConfig = parseServerConfig;
