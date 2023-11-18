"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCacheConfig = exports.cacheConfigSchema = void 0;
const moment_1 = __importDefault(require("moment"));
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
exports.cacheConfigSchema = zod_1.z.object({
    host: zod_1.z.string(),
    port: zod_1.z.number(),
    ttl: zod_1.z.string().transform((value) => {
        const duration = moment_1.default.duration(value);
        return duration.asMilliseconds();
    }),
    db: zod_1.z.number().default(0),
});
const parseCacheConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_CacheConfig_NotFound, "Cache config not found", 404);
    }
    try {
        const cacheConfig = exports.cacheConfigSchema.parse(config);
        return cacheConfig;
    }
    catch (error) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_CacheConfig_Invalid, "Invalid cache config", 400, error);
    }
};
exports.parseCacheConfig = parseCacheConfig;
