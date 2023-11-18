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
exports.errorCallback = exports.requestCallback = exports.responseCallback = void 0;
const axios_1 = __importDefault(require("axios"));
const exception_model_1 = require("../models/exception.model");
const request_callback_schema_1 = require("../schemas/callbacks/request.callback.schema");
const response_callback_schema_1 = require("../schemas/callbacks/response.callback.schema");
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const config_utils_1 = require("./config.utils");
const logger_utils_1 = __importDefault(require("./logger.utils"));
function makeClientCallback(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.webhook) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_InvalidCall, "Client type is not webhook", 500);
            }
            const clientConnectionConfig = (0, config_utils_1.getConfig)().client
                .connection;
            logger_utils_1.default.info(`\nWebhook Triggered on:==> ${clientConnectionConfig.url}\n\n`);
            const response = yield axios_1.default.post(clientConnectionConfig.url, data);
            logger_utils_1.default.info(`Response from Webhook:==>\n ${JSON.stringify(response.data)}\nWith Data\n${JSON.stringify(data)}\n\n`);
        }
        catch (error) {
            console.log("Error from makeClient");
            console.log("====>", error);
            if (error instanceof exception_model_1.Exception) {
                throw error;
            }
            if (error.response) {
                console.log("\n\n", error, "\n\n");
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_CallbackFailed, "Callback to client failed.", error.response.status, error.response.data);
            }
            else if (error.request) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_CallbackFailed, "Callback to client failed.", 500, error.request);
            }
            else {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_CallbackFailed, "Callback to client failed.", 500, error);
            }
        }
    });
}
function responseCallback(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_utils_1.default.info("Response cache SINoin");
            const callbackData = response_callback_schema_1.responseCallbackSchema.parse(data);
            yield makeClientCallback(callbackData);
        }
        catch (error) {
            if (error instanceof exception_model_1.Exception) {
                throw error;
            }
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_CallbackFailed, "Callback to client failed.", 500, error);
        }
    });
}
exports.responseCallback = responseCallback;
function requestCallback(data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const callbackData = request_callback_schema_1.requestCallbackSchema.parse(data);
            yield makeClientCallback(callbackData);
        }
        catch (error) {
            if (error instanceof exception_model_1.Exception) {
                throw error;
            }
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_CallbackFailed, "Callback to client failed.", 500, error);
        }
    });
}
exports.requestCallback = requestCallback;
function errorCallback(context, error) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield makeClientCallback({
                context: context,
                error: error
            });
        }
        catch (error) {
            if (error instanceof exception_model_1.Exception) {
                throw error;
            }
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_CallbackFailed, "Callback to client failed.", 500, error);
        }
    });
}
exports.errorCallback = errorCallback;
