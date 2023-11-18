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
exports.bppClientResponseSettler = exports.bppClientResponseHandler = void 0;
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const exception_model_1 = require("../models/exception.model");
const gateway_utils_1 = require("../utils/gateway.utils");
const request_cache_utils_1 = require("../utils/cache/request.cache.utils");
const callback_utils_1 = require("../utils/callback.utils");
const becknError_schema_1 = require("../schemas/becknError.schema");
const subscriberDetails_schema_1 = require("../schemas/subscriberDetails.schema");
const becknRequester_utils_1 = require("../utils/becknRequester.utils");
const auth_utils_1 = require("../utils/auth.utils");
const config_utils_1 = require("../utils/config.utils");
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const actions_utils_1 = require("../utils/actions.utils");
const acknowledgement_utils_1 = require("../utils/acknowledgement.utils");
const bppClientResponseHandler = (req, res, next, action) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, acknowledgement_utils_1.acknowledgeACK)(res, req.body.context);
        yield gateway_utils_1.GatewayUtils.getInstance().sendToNetworkSideGateway(req.body);
    }
    catch (err) {
        let exception = null;
        if (err instanceof exception_model_1.Exception) {
            exception = err;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Request_Failed, "BPP Response Failed at bppClientResponseHandler", 500, err);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bppClientResponseHandler = bppClientResponseHandler;
const bppClientResponseSettler = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const responseBody = JSON.parse(msg === null || msg === void 0 ? void 0 : msg.content.toString());
        const context = JSON.parse(JSON.stringify(responseBody.context));
        const message_id = responseBody.context.message_id;
        const requestAction = actions_utils_1.ActionUtils.getCorrespondingRequestAction(responseBody.context.action);
        const action = context.action;
        const bap_uri = responseBody.context.bap_uri;
        const requestCache = yield request_cache_utils_1.RequestCache.getInstance().check(message_id, requestAction);
        if (!requestCache) {
            (0, callback_utils_1.errorCallback)(context, {
                // TODO: change this error code.
                code: 651641,
                type: becknError_schema_1.BecknErrorType.coreError,
                message: "Request timed out"
            });
            return;
        }
        const axios_config = yield (0, auth_utils_1.createAuthHeaderConfig)(responseBody);
        let response = null;
        if (requestCache.sender.type == subscriberDetails_schema_1.NetworkPaticipantType.BG) {
            const subscribers = [requestCache.sender];
            response = yield (0, becknRequester_utils_1.callNetwork)(subscribers, responseBody, axios_config, action);
        }
        else {
            const subscribers = [
                Object.assign(Object.assign({}, requestCache.sender), { subscriber_url: bap_uri })
            ];
            response = yield (0, becknRequester_utils_1.callNetwork)(subscribers, responseBody, axios_config, action);
        }
        if (response.status == 200 ||
            response.status == 202 ||
            response.status == 206) {
            // Network Calls Succeeded.
            return;
        }
        switch ((0, config_utils_1.getConfig)().client.type) {
            case client_config_schema_1.ClientConfigType.synchronous: {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ClientConfig_Invalid, "Synchronous mode is not available for BPP.", 400);
                break;
            }
            case client_config_schema_1.ClientConfigType.messageQueue: {
                // TODO: implement message queue.
                break;
            }
            case client_config_schema_1.ClientConfigType.webhook: {
                (0, callback_utils_1.errorCallback)(context, {
                    // TODO: change the error code.
                    code: 354845,
                    message: "Network call failed",
                    type: becknError_schema_1.BecknErrorType.coreError,
                    data: [response]
                });
                break;
            }
        }
    }
    catch (error) {
        let exception = null;
        if (error instanceof exception_model_1.Exception) {
            exception = error;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Request_Failed, "BPP Response Failed at bppClientResponseSettler", 500, error);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bppClientResponseSettler = bppClientResponseSettler;
