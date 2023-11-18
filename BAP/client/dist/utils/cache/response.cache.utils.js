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
exports.ResponseCache = void 0;
const moment_1 = __importDefault(require("moment"));
const config_utils_1 = require("../config.utils");
const exception_model_1 = require("../../models/exception.model");
const mongo_utils_1 = require("../mongo.utils");
const responseCacheCollection = 'response_cache';
class ResponseCache {
    constructor() {
        if (!(0, config_utils_1.getConfig)().responseCache.enabled) {
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.ResponseCache_NotEnabled, "Response cache is not enabled.", 400);
        }
        this.dbClient = new mongo_utils_1.DBClient((0, config_utils_1.getConfig)().responseCache.mongoURL);
        this.createExpireIndex();
    }
    static getInstance() {
        if (!ResponseCache.instance) {
            ResponseCache.instance = new ResponseCache();
        }
        return ResponseCache.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, config_utils_1.getConfig)().responseCache.enabled) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.ResponseCache_NotEnabled, "Response cache is not enabled.", 400);
            }
            if (!this.dbClient.isConnected) {
                yield this.dbClient.connect();
            }
        });
    }
    createExpireIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            // Creating Expire Index.
            try {
                const collection = this.dbClient.getDB().collection(responseCacheCollection);
                const createResult = yield collection.createIndex({
                    expiresAt: 1
                }, {
                    expireAfterSeconds: 0
                });
                // console.log(createResult);
            }
            catch (error) {
                // console.log("Index is already Set...");
            }
        });
    }
    createParameters(requestBody) {
        const params = {
            context: {
                domain: requestBody.context.domain,
                country: requestBody.context.country,
                city: requestBody.context.city,
                action: requestBody.context.action,
                core_version: requestBody.context.core_version
            },
            message: requestBody.message
        };
        return params;
    }
    cacheRequest(requestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, config_utils_1.getConfig)().responseCache.enabled) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.ResponseCache_NotEnabled, "Response cache is not enabled.", 400);
            }
            const collection = this.dbClient.getDB().collection(responseCacheCollection);
            yield this.createExpireIndex();
            const expireDate = new Date(Date.now() + (0, config_utils_1.getConfig)().responseCache.ttl);
            const result = yield collection.insertOne({
                expiresAt: expireDate,
                transaction_id: requestBody.context.transaction_id,
                request: requestBody,
                parameters: this.createParameters(requestBody)
            });
            return result.insertedId.toString();
        });
    }
    cacheResponse(responseBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, config_utils_1.getConfig)().responseCache.enabled) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.ResponseCache_NotEnabled, "Response cache is not enabled.", 400);
            }
            const collecton = this.dbClient.getDB().collection(responseCacheCollection);
            yield this.createExpireIndex();
            const requestData = yield collecton.findOne({
                transaction_id: responseBody.context.transaction_id
            });
            if (!requestData) {
                return;
            }
            const ttlTime = moment_1.default.duration(responseBody.context.ttl ? responseBody.context.ttl : "PT0S").asMilliseconds();
            const expireDate = new Date(Date.now() + ttlTime);
            const result = yield collecton.updateOne({
                transaction_id: responseBody.context.transaction_id,
            }, {
                $addToSet: {
                    responses: responseBody
                },
                $set: {
                    expiresAt: expireDate
                }
            });
        });
    }
    check(requestBody) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, config_utils_1.getConfig)().responseCache.enabled) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.ResponseCache_NotEnabled, "Response cache is not enabled.", 400);
            }
            const collection = this.dbClient.getDB().collection(responseCacheCollection);
            const requestCursor = collection.find({
                parameters: this.createParameters(requestBody),
            });
            const requestsData = yield requestCursor.toArray();
            for (let i = 0; i < requestsData.length; i++) {
                if (((_b = (_a = requestsData[i]) === null || _a === void 0 ? void 0 : _a.responses) === null || _b === void 0 ? void 0 : _b.length) > 0) {
                    return requestsData[i].responses;
                }
            }
            return null;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, config_utils_1.getConfig)().responseCache.enabled) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.ResponseCache_NotEnabled, "Response cache is not enabled.", 400);
            }
            const collection = this.dbClient.getDB().collection(responseCacheCollection);
            yield collection.deleteMany({});
        });
    }
}
exports.ResponseCache = ResponseCache;
