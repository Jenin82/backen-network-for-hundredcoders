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
exports.authBuilderMiddleware = exports.authValidatorMiddleware = void 0;
const auth_utils_1 = require("../utils/auth.utils");
const config_utils_1 = require("../utils/config.utils");
const logger_utils_1 = __importDefault(require("../utils/logger.utils"));
const lookup_utils_1 = require("../utils/lookup.utils");
const config = require("config");
const authValidatorMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    try {
        logger_utils_1.default.info(`\nNew Request txn_id ${(_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.transaction_id}`);
        logger_utils_1.default.info(`Response from BPP ${JSON.stringify(req.body)}`);
        console.log("\nNew Request txn_id", (_d = (_c = req.body) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.transaction_id);
        if ((_f = (_e = req.body) === null || _e === void 0 ? void 0 : _e.context) === null || _f === void 0 ? void 0 : _f.bap_id) {
            console.log((_h = (_g = req.body) === null || _g === void 0 ? void 0 : _g.context) === null || _h === void 0 ? void 0 : _h.transaction_id, "Request from", (_k = (_j = req.body) === null || _j === void 0 ? void 0 : _j.context) === null || _k === void 0 ? void 0 : _k.bpp_id);
        }
        const auth_header = req.headers['authorization'] || "";
        const proxy_header = req.headers['proxy-authorization'] || "";
        console.log((_m = (_l = req.body) === null || _l === void 0 ? void 0 : _l.context) === null || _m === void 0 ? void 0 : _m.transaction_id, "headers", req.headers);
        let authVerified = true;
        const isAuthRequired = config.get('app.auth');
        if (isAuthRequired) {
            var verified = yield (0, auth_utils_1.verifyHeader)(auth_header, req, res);
            var verified_proxy = proxy_header ? yield (0, auth_utils_1.verifyHeader)(proxy_header, req, res) : true;
            console.log((_p = (_o = req.body) === null || _o === void 0 ? void 0 : _o.context) === null || _p === void 0 ? void 0 : _p.transaction_id, "Verification status:", verified, "Proxy verification:", verified_proxy);
            authVerified = verified && verified_proxy;
        }
        if (authVerified) {
            const senderDetails = yield (0, auth_utils_1.getSenderDetails)(auth_header);
            res.locals.sender = senderDetails;
            next();
        }
        else {
            res.status(401).json({
                message: {
                    ack: {
                        status: "NACK"
                    }
                },
                error: {
                    message: "Authentication failed"
                }
            });
        }
    }
    catch (err) {
        next(err);
    }
});
exports.authValidatorMiddleware = authValidatorMiddleware;
function authBuilderMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const axios_config = yield (0, auth_utils_1.createAuthHeaderConfig)(req.body);
            req.headers.authorization = axios_config.headers.authorization;
            const senderDetails = yield (0, lookup_utils_1.getSubscriberDetails)((0, config_utils_1.getConfig)().app.subscriberId, (0, config_utils_1.getConfig)().app.uniqueKey);
            res.locals.sender = senderDetails;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.authBuilderMiddleware = authBuilderMiddleware;
