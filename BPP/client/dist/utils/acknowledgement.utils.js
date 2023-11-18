"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.acknowledgeNACK = exports.acknowledgeACK = void 0;
const exception_model_1 = require("../models/exception.model");
const becknError_schema_1 = require("../schemas/becknError.schema");
const logger_utils_1 = __importDefault(require("./logger.utils"));
function acknowledge(res, data) {
    try {
        res.status(202).json(data);
    }
    catch (error) {
        if (error instanceof exception_model_1.Exception) {
            throw error;
        }
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Acknowledgement_Failed, "Acknowledge to client connection failed", 500, error);
    }
}
function acknowledgeACK(res, context) {
    try {
        const contextData = JSON.parse(JSON.stringify(context));
        acknowledge(res, {
            context: contextData,
            message: {
                ack: {
                    status: "ACK"
                }
            }
        });
    }
    catch (error) {
        if (error instanceof exception_model_1.Exception) {
            logger_utils_1.default.error(error);
            throw error;
        }
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Acknowledgement_Failed, "Acknowledge to client connection failed", 500, error);
    }
}
exports.acknowledgeACK = acknowledgeACK;
function acknowledgeNACK(res, context, error) {
    try {
        const errorData = becknError_schema_1.becknErrorSchema.parse(error);
        const contextData = JSON.parse(JSON.stringify(context));
        acknowledge(res, {
            context: contextData,
            message: {
                ack: {
                    status: "NACK"
                }
            },
            error: errorData
        });
    }
    catch (error) {
        if (error instanceof exception_model_1.Exception) {
            throw error;
        }
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Acknowledgement_Failed, "Acknowledge to client connection failed", 500, error);
    }
}
exports.acknowledgeNACK = acknowledgeNACK;
