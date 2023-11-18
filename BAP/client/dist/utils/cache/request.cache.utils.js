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
exports.RequestCache = void 0;
const request_cache_schema_1 = require("../../schemas/cache/request.cache.schema");
const config_utils_1 = require("../config.utils");
const redis_utils_1 = require("../redis.utils");
const logger_utils_1 = __importDefault(require("../logger.utils"));
const requestCacheDB = (0, config_utils_1.getConfig)().cache.db * 10 + 2;
class RequestCache {
    constructor() {
        this.redisClient = new redis_utils_1.RedisClient(requestCacheDB);
    }
    static getInstance() {
        if (!RequestCache.instance) {
            RequestCache.instance = new RequestCache();
        }
        return RequestCache.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_utils_1.default.info("Request Cache Initialized...");
        });
    }
    createKey(message_id, action) {
        const key = `${action}_${message_id}`;
        return key;
    }
    cache(request, ttl) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.createKey(request.message_id, request.action);
            const redisResponse = yield this.redisClient.setWithExpiry(key, JSON.stringify(request), ttl);
            return redisResponse;
        });
    }
    check(message_id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = this.createKey(message_id, action);
            const redisResponse = yield this.redisClient.get(key);
            if (redisResponse) {
                const request = request_cache_schema_1.RequestCacheSchema.parse(JSON.parse(redisResponse));
                return request;
            }
            return null;
        });
    }
    delete(message_id, action) {
        return __awaiter(this, void 0, void 0, function* () {
            const redisResponse = yield this.redisClient.delete(message_id);
            return redisResponse;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisResponse = yield this.redisClient.flushDB();
            return redisResponse;
        });
    }
}
exports.RequestCache = RequestCache;
