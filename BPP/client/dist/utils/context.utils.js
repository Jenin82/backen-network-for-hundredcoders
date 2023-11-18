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
exports.bppContextBuilder = exports.bapContextBuilder = void 0;
const moment_1 = __importDefault(require("moment"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const exception_model_1 = require("../models/exception.model");
const actions_utils_1 = require("./actions.utils");
const config_utils_1 = require("./config.utils");
const logger_utils_1 = __importDefault(require("./logger.utils"));
const bapContextBuilder = (context, action) => __awaiter(void 0, void 0, void 0, function* () {
    if (!context) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_NotFound, "Context not found", 404);
    }
    if (!context.domain) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_DomainNotFound, "Domain not found in the context", 404);
    }
    if (!context.version && !(context === null || context === void 0 ? void 0 : context.core_version)) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_CoreVersionNotFound, "Core version not found in the context", 404);
    }
    const rawdata = yield fs_1.default.promises.readFile(`schemas/context_${context.version ? context.version : context.core_version}.json`);
    const bapContext = Object.entries(JSON.parse(rawdata)).reduce((accum, [key, val]) => {
        accum[key] = eval(val);
        return accum;
    }, {
        ttl: moment_1.default.duration((0, config_utils_1.getConfig)().app.ttl, "ms").toISOString(),
        action: actions_utils_1.ActionUtils.parseAction(context.action),
        timestamp: new Date().toISOString(),
        message_id: (0, uuid_1.v4)(),
        key: context === null || context === void 0 ? void 0 : context.key,
        transaction_id: context.transaction_id
            ? context.transaction_id
            : (0, uuid_1.v4)()
    });
    logger_utils_1.default.info(`BAP Context:\n ${JSON.stringify(bapContext)}\n\n`);
    return bapContext;
});
exports.bapContextBuilder = bapContextBuilder;
const bppContextBuilder = (context, action) => {
    if (!context) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_NotFound, "Context not found", 404);
    }
    if (!context.domain) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_DomainNotFound, "Domain not found in the context", 404);
    }
    if (!context.core_version && !context.version) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_CoreVersionNotFound, "Core version not found in the context", 404);
    }
    if (!context.transaction_id) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_TransactionIdNotFound, "transaction_id not found in the context", 404);
    }
    if (!context.message_id) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Context_MessageIdNotFound, "message_id not found in the context", 404);
    }
    const bppContext = {
        domain: context.domain,
        action: actions_utils_1.ActionUtils.parseAction(context.action),
        version: context === null || context === void 0 ? void 0 : context.version,
        core_version: context === null || context === void 0 ? void 0 : context.core_version,
        bpp_id: context.bpp_id ? context.bpp_id : (0, config_utils_1.getConfig)().app.subscriberId,
        bpp_uri: context.bpp_uri ? context.bpp_uri : (0, config_utils_1.getConfig)().app.subscriberUri,
        country: (context === null || context === void 0 ? void 0 : context.country) ? context.country : (0, config_utils_1.getConfig)().app.country,
        city: (context === null || context === void 0 ? void 0 : context.city) ? context.city : (0, config_utils_1.getConfig)().app.city,
        location: context === null || context === void 0 ? void 0 : context.location,
        bap_id: context.bap_id,
        bap_uri: context.bap_uri,
        transaction_id: context.transaction_id,
        message_id: context.message_id,
        ttl: moment_1.default.duration((0, config_utils_1.getConfig)().app.ttl, "ms").toISOString(),
        timestamp: new Date().toISOString()
    };
    return bppContext;
};
exports.bppContextBuilder = bppContextBuilder;
