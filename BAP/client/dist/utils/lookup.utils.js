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
exports.getSubscriberDetails = exports.registryLookup = exports.combineURLs = void 0;
const axios_1 = __importDefault(require("axios"));
const exception_model_1 = require("../models/exception.model");
const subscriberDetails_schema_1 = require("../schemas/subscriberDetails.schema");
const config_utils_1 = require("./config.utils");
const lookup_cache_utils_1 = require("./cache/lookup.cache.utils");
const logger_utils_1 = __importDefault(require("./logger.utils"));
function combineURLs(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
}
exports.combineURLs = combineURLs;
const registryLookup = (lookupParameter) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lookupCache = lookup_cache_utils_1.LookupCache.getInstance();
        const cachedResponse = yield lookupCache.check(lookupParameter);
        if (cachedResponse && cachedResponse.length > 0) {
            logger_utils_1.default.info(`returning response from cache`);
            logger_utils_1.default.info(`cachedResponse: ${JSON.stringify(cachedResponse)}`);
            return cachedResponse;
        }
        console.log("\nLooking Up in registry...!\n");
        logger_utils_1.default.info(`\nLooking Up in registry...!\nWith URL:${combineURLs((0, config_utils_1.getConfig)().app.registryUrl, "/lookup")}\n Payload:${JSON.stringify(lookupParameter)}`);
        const response = yield axios_1.default.post(combineURLs((0, config_utils_1.getConfig)().app.registryUrl, "/lookup"), lookupParameter);
        const subscribers = [];
        response.data.forEach((data) => {
            try {
                const subscriberData = subscriberDetails_schema_1.subscriberDetailsSchema.parse(data);
                subscribers.push(subscriberData);
            }
            catch (error) {
                // console.log(data);
                // console.log(error);
            }
        });
        lookupCache.cache(lookupParameter, subscribers);
        logger_utils_1.default.info(`subscribers: ${JSON.stringify(subscribers)}`);
        return subscribers;
    }
    catch (error) {
        if (error instanceof exception_model_1.Exception) {
            throw error;
        }
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Registry_LookupError, "Error in registry lookup", 500, error);
    }
});
exports.registryLookup = registryLookup;
function getSubscriberDetails(subscriber_id, unique_key_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subsribers = yield (0, exports.registryLookup)({
                subscriber_id: subscriber_id,
                unique_key_id: unique_key_id
            });
            if (subsribers.length == 0) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Registry_NoSubscriberFound, "No subscriber found", 404);
            }
            return subsribers[0];
        }
        catch (error) {
            if (error instanceof exception_model_1.Exception) {
                throw error;
            }
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Registry_LookupError, "Error in registry lookup", 500, error);
        }
    });
}
exports.getSubscriberDetails = getSubscriberDetails;
