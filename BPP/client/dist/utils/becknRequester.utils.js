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
exports.callNetwork = exports.makeBecknRequest = void 0;
const axiosCall = require('axios').default;
const axios_1 = __importDefault(require("axios"));
const config_utils_1 = require("./config.utils");
const logger_utils_1 = __importDefault(require("./logger.utils"));
const lookup_utils_1 = require("./lookup.utils");
const makeBecknRequest = (subscriberUrl, body, axios_config, retry_count, action) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const requestURL = (0, lookup_utils_1.combineURLs)(subscriberUrl, `/${action}`);
        const response = yield axios_1.default.post(requestURL, body, axios_config);
        return {
            data: JSON.stringify(response.data),
            status: response.status
        };
    }
    catch (error) {
        let response;
        if (axios_1.default.isAxiosError(error)) {
            response = {
                data: JSON.stringify((_a = error.response) === null || _a === void 0 ? void 0 : _a.data),
                status: ((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) ? (_c = error.response) === null || _c === void 0 ? void 0 : _c.status : 500
            };
        }
        else {
            response = {
                data: "No Response",
                status: 500
            };
        }
        if (retry_count == 0) {
            return response;
        }
        return yield (0, exports.makeBecknRequest)(subscriberUrl, body, axios_config, retry_count - 1, action);
    }
});
exports.makeBecknRequest = makeBecknRequest;
function callNetwork(subscribers, body, axios_config, action) {
    return __awaiter(this, void 0, void 0, function* () {
        if (subscribers.length == 0) {
            return {
                data: "No Subscribers found",
                status: 500
            };
        }
        for (let i = 0; i < subscribers.length; i++) {
            logger_utils_1.default.info(`Attempt Number: ${i + 1} \nAction : ${action}`);
            logger_utils_1.default.info(`sending request to BG / BPP: ${subscribers[i].subscriber_url}`);
            logger_utils_1.default.info(`Request Body: ${JSON.stringify(body)}`);
            const response = yield (0, exports.makeBecknRequest)(subscribers[i].subscriber_url, body, axios_config, (0, config_utils_1.getConfig)().app.httpRetryCount, action);
            if ((response.status == 200) || (response.status == 201) || (response.status == 202) || (response.status == 204)) {
                logger_utils_1.default.info(`Result : Request Successful \nStatus: ${response.status} \nData : ${response.data} \nSubscriber URL: ${subscribers[i].subscriber_url}`);
                return response;
            }
            logger_utils_1.default.error(`Result : Failed call to Subscriber: ${subscribers[i].subscriber_url}, \nStatus: ${response.status}, \nData: ${response.data}`);
        }
        return {
            data: "No Response",
            status: 500
        };
    });
}
exports.callNetwork = callNetwork;
