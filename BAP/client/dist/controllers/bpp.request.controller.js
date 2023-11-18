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
exports.bppNetworkRequestSettler = exports.bppNetworkRequestHandler = void 0;
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const exception_model_1 = require("../models/exception.model");
const acknowledgement_utils_1 = require("../utils/acknowledgement.utils");
const gateway_utils_1 = require("../utils/gateway.utils");
const request_cache_utils_1 = require("../utils/cache/request.cache.utils");
const request_cache_schema_1 = require("../schemas/cache/request.cache.schema");
const moment_1 = __importDefault(require("moment"));
const config_utils_1 = require("../utils/config.utils");
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const callback_utils_1 = require("../utils/callback.utils");
const bppNetworkRequestHandler = (req, res, next, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, acknowledgement_utils_1.acknowledgeACK)(res, req.body.context);
        const message_id = req.body.context.message_id;
        const transaction_id = req.body.context.transaction_id;
        const ttl = moment_1.default.duration(req.body.context.ttl).asMilliseconds();
        yield request_cache_utils_1.RequestCache.getInstance().cache((0, request_cache_schema_1.parseRequestCache)(transaction_id, message_id, action, res.locals.sender), ttl);
        yield gateway_utils_1.GatewayUtils.getInstance().sendToClientSideGateway(req.body);
    }
    catch (err) {
        let exception = null;
        if (err instanceof exception_model_1.Exception) {
            exception = err;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Request_Failed, "BPP Request Failed at bppNetworkRequestHandler", 500, err);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bppNetworkRequestHandler = bppNetworkRequestHandler;
const bppNetworkRequestSettler = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestBody = JSON.parse(msg === null || msg === void 0 ? void 0 : msg.content.toString());
        switch ((0, config_utils_1.getConfig)().client.type) {
            case client_config_schema_1.ClientConfigType.synchronous: {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ClientConfig_Invalid, "Synchronous mode is not available for BPP.", 500);
                break;
            }
            case client_config_schema_1.ClientConfigType.webhook: {
                (0, callback_utils_1.requestCallback)(requestBody);
                break;
            }
            case client_config_schema_1.ClientConfigType.messageQueue: {
                // TODO: implement message queue
                break;
            }
        }
    }
    catch (err) {
        let exception = null;
        if (err instanceof exception_model_1.Exception) {
            exception = err;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Request_Failed, "BPP Request Failed at bppNetworkRequestSettler", 500, err);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bppNetworkRequestSettler = bppNetworkRequestSettler;
