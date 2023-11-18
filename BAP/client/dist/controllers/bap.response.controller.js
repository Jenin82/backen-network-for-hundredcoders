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
exports.bapNetworkResponseSettler = exports.bapNetworkResponseHandler = void 0;
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const exception_model_1 = require("../models/exception.model");
const actions_utils_1 = require("../utils/actions.utils");
const request_cache_utils_1 = require("../utils/cache/request.cache.utils");
const acknowledgement_utils_1 = require("../utils/acknowledgement.utils");
const becknError_schema_1 = require("../schemas/becknError.schema");
const gateway_utils_1 = require("../utils/gateway.utils");
const config_utils_1 = require("../utils/config.utils");
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const sync_cache_utils_1 = require("../utils/cache/sync.cache.utils");
const callback_utils_1 = require("../utils/callback.utils");
const bapNetworkResponseHandler = (req, res, next, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestAction = actions_utils_1.ActionUtils.getCorrespondingRequestAction(action);
        const message_id = req.body.context.message_id;
        const requestCache = yield request_cache_utils_1.RequestCache.getInstance().check(message_id, requestAction);
        if (!requestCache) {
            (0, acknowledgement_utils_1.acknowledgeNACK)(res, req.body.context, {
                // TODO: change the error code.
                code: 6781616,
                message: "Response timed out",
                type: becknError_schema_1.BecknErrorType.coreError
            });
            return;
        }
        logger_utils_1.default.info(`\nsending ack to bpp\n\n`);
        logger_utils_1.default.info(`request to bpp ${JSON.stringify(req.body.context)}`);
        (0, acknowledgement_utils_1.acknowledgeACK)(res, req.body.context);
        logger_utils_1.default.info(`sending response to inbox queue`);
        logger_utils_1.default.info(`response: ${JSON.stringify(req.body)}`);
        yield gateway_utils_1.GatewayUtils.getInstance().sendToClientSideGateway(req.body);
    }
    catch (err) {
        let exception = null;
        if (err instanceof exception_model_1.Exception) {
            exception = err;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Response_Failed, "BAP Response Failed at bapNetworkResponseHandler", 500, err);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bapNetworkResponseHandler = bapNetworkResponseHandler;
const bapNetworkResponseSettler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_utils_1.default.info("Protocol Client Server (Network Settler) recieving message from inbox queue");
        const responseBody = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
        logger_utils_1.default.info(`Response from BAP NETWORK:\n ${JSON.stringify(responseBody)}\n\n`);
        const message_id = responseBody.context.message_id;
        const action = actions_utils_1.ActionUtils.getCorrespondingRequestAction(responseBody.context.action);
        switch ((0, config_utils_1.getConfig)().client.type) {
            case client_config_schema_1.ClientConfigType.synchronous: {
                yield sync_cache_utils_1.SyncCache.getInstance().insertResponse(message_id, action, responseBody);
                break;
            }
            case client_config_schema_1.ClientConfigType.webhook: {
                console.log("S");
                (0, callback_utils_1.responseCallback)(responseBody);
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
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Response_Failed, "BAP Response Failed at bapNetworkResponseSettler", 500, err);
        }
        logger_utils_1.default.error(err);
    }
});
exports.bapNetworkResponseSettler = bapNetworkResponseSettler;
