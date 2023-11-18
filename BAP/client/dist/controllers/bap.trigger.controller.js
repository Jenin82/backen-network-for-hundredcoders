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
exports.bapClientTriggerSettler = exports.bapClientTriggerHandler = void 0;
const actions_app_config_schema_1 = require("../schemas/configs/actions.app.config.schema");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const acknowledgement_utils_1 = require("../utils/acknowledgement.utils");
const becknError_schema_1 = require("../schemas/becknError.schema");
const config_utils_1 = require("../utils/config.utils");
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const request_cache_utils_1 = require("../utils/cache/request.cache.utils");
const request_cache_schema_1 = require("../schemas/cache/request.cache.schema");
const gateway_utils_1 = require("../utils/gateway.utils");
const syncResponses_utils_1 = require("../utils/syncResponses.utils");
const exception_model_1 = require("../models/exception.model");
const auth_utils_1 = require("../utils/auth.utils");
const lookup_utils_1 = require("../utils/lookup.utils");
const subscriberDetails_schema_1 = require("../schemas/subscriberDetails.schema");
const becknRequester_utils_1 = require("../utils/becknRequester.utils");
const sync_cache_utils_1 = require("../utils/cache/sync.cache.utils");
const callback_utils_1 = require("../utils/callback.utils");
const bapClientTriggerHandler = (req, res, next, action) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const bpp_id = req.body.context.bpp_id;
        const bpp_uri = req.body.context.bpp_uri;
        if (action != actions_app_config_schema_1.RequestActions.search &&
            (!bpp_id || !bpp_uri || bpp_id == "" || bpp_uri == "")) {
            (0, acknowledgement_utils_1.acknowledgeNACK)(res, req.body.context, {
                // TODO: change the error code.
                code: 6781616,
                message: "All triggers other than search requires bpp_id and bpp_uri. \nMissing bpp_id or bpp_uri",
                type: becknError_schema_1.BecknErrorType.contextError
            });
            return;
        }
        if ((0, config_utils_1.getConfig)().client.type == client_config_schema_1.ClientConfigType.webhook) {
            (0, acknowledgement_utils_1.acknowledgeACK)(res, req.body.context);
        }
        yield request_cache_utils_1.RequestCache.getInstance().cache((0, request_cache_schema_1.parseRequestCache)(req.body.context.transaction_id, req.body.context.message_id, action, res.locals.sender), (_a = (0, config_utils_1.getConfig)().app.actions.requests[action]) === null || _a === void 0 ? void 0 : _a.ttl);
        logger_utils_1.default.info("sending message to outbox queue \n\n");
        logger_utils_1.default.info(`Request from client:\n ${JSON.stringify(req.body)}\n`);
        yield gateway_utils_1.GatewayUtils.getInstance().sendToNetworkSideGateway(req.body);
        if ((0, config_utils_1.getConfig)().client.type == client_config_schema_1.ClientConfigType.synchronous) {
            (0, syncResponses_utils_1.sendSyncResponses)(res, req.body.context.message_id, action, req.body.context);
        }
    }
    catch (err) {
        let exception = null;
        if (err instanceof exception_model_1.Exception) {
            exception = err;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Request_Failed, "BAP Request Failed at bapClientTriggerHandler", 500, err);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bapClientTriggerHandler = bapClientTriggerHandler;
const bapClientTriggerSettler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_utils_1.default.info("Protocol Network Server (Client Settler) recieving message from outbox queue");
        const requestBody = JSON.parse(message === null || message === void 0 ? void 0 : message.content.toString());
        logger_utils_1.default.info(`request: ${JSON.stringify(requestBody)}`);
        const context = JSON.parse(JSON.stringify(requestBody.context));
        const axios_config = yield (0, auth_utils_1.createAuthHeaderConfig)(requestBody);
        const bpp_id = requestBody.context.bpp_id;
        const bpp_uri = requestBody.context.bpp_uri;
        const action = requestBody.context.action;
        let response;
        if (bpp_id && bpp_uri && bpp_id !== "" && bpp_uri !== "") {
            const subscribers = yield (0, lookup_utils_1.registryLookup)({
                type: subscriberDetails_schema_1.NetworkPaticipantType.BPP,
                domain: requestBody.context.domain,
                subscriber_id: bpp_id
            });
            for (let i = 0; i < subscribers.length; i++) {
                subscribers[i].subscriber_url = bpp_uri;
            }
            response = yield (0, becknRequester_utils_1.callNetwork)(subscribers, requestBody, axios_config, action);
        }
        else {
            const subscribers = yield (0, lookup_utils_1.registryLookup)({
                type: subscriberDetails_schema_1.NetworkPaticipantType.BG,
                domain: requestBody.context.domain
            });
            response = yield (0, becknRequester_utils_1.callNetwork)(subscribers, requestBody, axios_config, action);
        }
        if (response.status == 200 ||
            response.status == 202 ||
            response.status == 206) {
            // Network Calls Succeeded.
            return;
        }
        switch ((0, config_utils_1.getConfig)().client.type) {
            case client_config_schema_1.ClientConfigType.synchronous: {
                const message_id = requestBody.context.message_id;
                yield sync_cache_utils_1.SyncCache.getInstance().recordError(message_id, action, {
                    // TODO: change this error code.
                    code: 651641,
                    type: becknError_schema_1.BecknErrorType.coreError,
                    message: "Network Participant Request Failed...",
                    data: [response]
                });
                break;
            }
            case client_config_schema_1.ClientConfigType.messageQueue: {
                // TODO: Implement message queue.
                break;
            }
            case client_config_schema_1.ClientConfigType.webhook: {
                yield (0, callback_utils_1.errorCallback)(context, {
                    // TODO: change this error code.
                    code: 651641,
                    type: becknError_schema_1.BecknErrorType.coreError,
                    message: "Network Participant Request Failed...",
                    data: [response]
                });
                break;
            }
        }
        return;
    }
    catch (err) {
        let exception = null;
        if (err instanceof exception_model_1.Exception) {
            exception = err;
        }
        else {
            exception = new exception_model_1.Exception(exception_model_1.ExceptionType.Request_Failed, "BAP Request Failed at bapClientTriggerSettler", 500, err);
        }
        logger_utils_1.default.error(exception);
    }
});
exports.bapClientTriggerSettler = bapClientTriggerSettler;
