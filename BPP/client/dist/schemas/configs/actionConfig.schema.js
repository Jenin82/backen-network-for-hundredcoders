"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseActionConfig = exports.actionConfigSchema = void 0;
const moment_1 = __importDefault(require("moment"));
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
exports.actionConfigSchema = zod_1.z.object({
    ttl: zod_1.z.string().transform((value) => {
        const duration = moment_1.default.duration(value);
        return duration.asMilliseconds();
    }).default("PT10S")
});
const parseActionConfig = (config) => {
    if (!config) {
        return {
            ttl: 10000,
        };
    }
    try {
        const actionConfig = exports.actionConfigSchema.parse(config);
        return actionConfig;
    }
    catch (error) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ActionConfig_Invalid, "Invalid action config", 400, error);
    }
};
exports.parseActionConfig = parseActionConfig;
