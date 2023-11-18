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
exports.SyncCache = void 0;
const exception_model_1 = require("../../models/exception.model");
const sync_cache_schema_1 = require("../../schemas/cache/sync.cache.schema");
const client_config_schema_1 = require("../../schemas/configs/client.config.schema");
const config_utils_1 = require("../config.utils");
const mongo_utils_1 = require("../mongo.utils");
const syncCacheCollectionName = "sync_cache";
class SyncCache {
    constructor() {
        if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
        }
        const syncCacheConfig = (0, config_utils_1.getConfig)().client.connection;
        this.dbClient = new mongo_utils_1.DBClient(syncCacheConfig.mongoURL);
    }
    static getInstance() {
        if (!SyncCache.instance) {
            SyncCache.instance = new SyncCache();
        }
        return SyncCache.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
        });
    }
    initCache(message_id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
            const collection = this.dbClient.getDB().collection(syncCacheCollectionName);
            yield collection.insertOne({
                message_id,
                action,
                created_at: new Date(),
                responses: []
            });
        });
    }
    insertResponse(message_id, action, response) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
            const collection = this.dbClient.getDB().collection(syncCacheCollectionName);
            yield collection.updateOne({
                message_id,
                action
            }, {
                $push: {
                    responses: response
                }
            });
        });
    }
    recordError(message_id, action, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
            const collection = this.dbClient.getDB().collection(syncCacheCollectionName);
            yield collection.updateOne({
                message_id,
                action
            }, {
                error: error
            });
        });
    }
    getData(message_id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
            const collection = this.dbClient.getDB().collection(syncCacheCollectionName);
            const result = yield collection.findOne({
                message_id,
                action
            });
            if (!result) {
                return null;
            }
            return sync_cache_schema_1.syncCacheSchema.parse(result);
        });
    }
    deleteData(message_id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
            const collection = this.dbClient.getDB().collection(syncCacheCollectionName);
            yield collection.deleteOne({
                message_id,
                action
            });
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().client.type != client_config_schema_1.ClientConfigType.synchronous) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.SyncCache_InvalidUse, "Sync Cache should be used only in case the client connection mode is synchronous.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
            const collection = this.dbClient.getDB().collection(syncCacheCollectionName);
            yield collection.deleteMany({});
        });
    }
}
exports.SyncCache = SyncCache;
;
