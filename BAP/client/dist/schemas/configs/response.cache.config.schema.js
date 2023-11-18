"use strict";
// Create response cache config schema.
// Create parser function for the same.
// In case enabled true then it should have mongoURL and ttl.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResponseCacheConfig = exports.responseCacheConfigSchema = void 0;
const moment_1 = __importDefault(require("moment"));
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
exports.responseCacheConfigSchema = zod_1.z.object({
    enabled: zod_1.z.boolean(),
    mongoURL: zod_1.z.string().optional(),
    ttl: zod_1.z.string().transform((value) => {
        const duration = moment_1.default.duration(value);
        return duration.asMilliseconds();
    }).optional(),
});
const parseResponseCacheConfig = (config) => {
    if (!config) {
        return {
            enabled: false,
        };
    }
    if (!config.mongoURL) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ResponseCacheConfig_Invalid, "Response cache configuration is invalid, mongoURL is required.", 400);
    }
    if (!config.ttl) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ResponseCacheConfig_Invalid, "Response cache configuration is invalid, ttl is required.", 400);
    }
    const responseCacheConfig = exports.responseCacheConfigSchema.parse({
        enabled: true,
        mongoURL: config.mongoURL,
        ttl: config.ttl,
    });
    return responseCacheConfig;
};
exports.parseResponseCacheConfig = parseResponseCacheConfig;
