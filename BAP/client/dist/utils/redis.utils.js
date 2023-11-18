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
exports.RedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const exception_model_1 = require("../models/exception.model");
const config_utils_1 = require("./config.utils");
const logger_utils_1 = __importDefault(require("./logger.utils"));
class RedisClient {
    constructor(db = 0) {
        this.cacheEnabled = false;
        try {
            this.redis = new ioredis_1.default({
                host: (0, config_utils_1.getConfig)().cache.host,
                port: (0, config_utils_1.getConfig)().cache.port,
                db: db
            });
            this.cacheEnabled = true;
        }
        catch (error) {
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Cache_NotIntialized, "Cache is not intialized.", 500, error);
        }
        logger_utils_1.default.info(`Redis Client Connected For DB: ${db}`);
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheEnabled) {
                return yield this.redis.get(key);
            }
            else {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Cache_NotIntialized, "Cache is not intialized.", 500);
            }
        });
    }
    delete(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheEnabled) {
                return (yield this.redis.del(key)) === 1;
            }
            else {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Cache_NotIntialized, "Cache is not intialized.", 500);
            }
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheEnabled) {
                return (yield this.redis.set(key, value)) === "OK";
            }
            else {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Cache_NotIntialized, "Cache is not intialized.", 500);
            }
        });
    }
    setWithExpiry(key, value, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheEnabled) {
                return (yield this.redis.set(key, value, "EX", expiry)) === "OK";
            }
            else {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Cache_NotIntialized, "Cache is not intialized.", 500);
            }
        });
    }
    flushDB() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.cacheEnabled) {
                return (yield this.redis.flushdb()) === "OK";
            }
            else {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Cache_NotIntialized, "Cache is not intialized.", 500);
            }
        });
    }
}
exports.RedisClient = RedisClient;
