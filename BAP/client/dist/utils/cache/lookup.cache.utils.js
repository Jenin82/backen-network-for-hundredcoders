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
exports.LookupCache = void 0;
const lookupParameter_schema_1 = require("../../schemas/lookupParameter.schema");
const subscriberDetails_schema_1 = require("../../schemas/subscriberDetails.schema");
const config_utils_1 = require("../config.utils");
const redis_utils_1 = require("../redis.utils");
const logger_utils_1 = __importDefault(require("../logger.utils"));
const emptyPlaceHolder = 'N/A';
const lookupCacheDB = (0, config_utils_1.getConfig)().cache.db * 10 + 1;
class LookupCache {
    constructor() {
        this.redisClient = new redis_utils_1.RedisClient(lookupCacheDB);
    }
    static getInstance() {
        if (!LookupCache.instance) {
            LookupCache.instance = new LookupCache();
        }
        return LookupCache.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            logger_utils_1.default.info("Lookup Cache Initialized...");
        });
    }
    createQueryKey(parameters) {
        const queryObj = {
            domain: (parameters.domain) ? parameters.domain : emptyPlaceHolder,
            subscriber_id: (parameters.subscriber_id) ? parameters.subscriber_id : emptyPlaceHolder,
            type: (parameters.type) ? parameters.type : emptyPlaceHolder,
            unique_key_id: (parameters.unique_key_id) ? parameters.unique_key_id : emptyPlaceHolder,
        };
        const queryString = JSON.stringify(queryObj);
        const queryBuffer = Buffer.from(queryString, 'utf-8');
        return queryBuffer.toString('base64url');
    }
    convertToQuery(queryKey) {
        const queryBuffer = Buffer.from(queryKey, 'base64url');
        const queryString = queryBuffer.toString('utf-8');
        const queryObj = lookupParameter_schema_1.lookupParameterSchema.parse(JSON.parse(queryString));
        return queryObj;
    }
    cache(parameters, subscribers) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryKey = this.createQueryKey(parameters);
            let expireSeconds = (0, config_utils_1.getConfig)().cache.ttl;
            subscribers.forEach((subscriber) => {
                const validUntillDate = Date.parse(subscriber.valid_until);
                const currExpireSeconds = validUntillDate - Date.now();
                expireSeconds = Math.min(expireSeconds, currExpireSeconds);
            });
            const redisResponse = yield this.redisClient.setWithExpiry(queryKey, JSON.stringify(subscribers), expireSeconds);
            return redisResponse;
        });
    }
    check(parameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryKey = this.createQueryKey(parameters);
            console.log('queryKey :', queryKey);
            const redisResponse = yield this.redisClient.get(queryKey);
            //bug fix: added validation for redisResponse == '[]'
            if (!redisResponse) {
                return null;
            }
            console.log('queryKey :', queryKey);
            console.log('redisResponse :', redisResponse);
            const subsObjs = JSON.parse(redisResponse);
            const subscribers = [];
            subsObjs.forEach((subObj) => {
                try {
                    const subscriberData = subscriberDetails_schema_1.subscriberDetailsSchema.parse(subObj);
                    subscribers.push(subscriberData);
                }
                catch (error) {
                    // console.log(data);
                    // console.log(error);
                }
            });
            return subscribers;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            const redisResponse = yield this.redisClient.flushDB();
            console.log("Lookup Cache Cleared...");
            return redisResponse;
        });
    }
}
exports.LookupCache = LookupCache;
