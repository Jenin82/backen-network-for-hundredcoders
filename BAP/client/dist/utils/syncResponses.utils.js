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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSyncResponses = void 0;
const exception_model_1 = require("../models/exception.model");
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const sync_cache_utils_1 = require("./cache/sync.cache.utils");
const config_utils_1 = require("./config.utils");
function sendSyncResponses(res, message_id, action, context) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_InvalidCall, "Synchronous client is not configured.", 500);
            }
            const syncCache = sync_cache_utils_1.SyncCache.getInstance();
            syncCache.initCache(message_id, action);
            const waitTime = ((_a = (0, config_utils_1.getConfig)().app.actions.requests[action]) === null || _a === void 0 ? void 0 : _a.ttl) ? (_b = (0, config_utils_1.getConfig)().app.actions.requests[action]) === null || _b === void 0 ? void 0 : _b.ttl : 30 * 1000;
            yield sleep(waitTime);
            const syncCacheData = yield syncCache.getData(message_id, action);
            if (!syncCacheData) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_SyncCacheDataNotFound, `Sync cache data not found for message_id: ${message_id} and action: ${action}`, 404);
            }
            if (syncCacheData.error) {
                res.status(400).json({
                    context,
                    error: syncCacheData.error
                });
                return;
            }
            res.status(200).json({
                context,
                responses: syncCacheData.responses
            });
        }
        catch (error) {
            if (error instanceof exception_model_1.Exception) {
                throw error;
            }
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Client_SendSyncReponsesFailed, "Send Synchronous Responses Failed.", 500, error);
        }
    });
}
exports.sendSyncResponses = sendSyncResponses;
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
