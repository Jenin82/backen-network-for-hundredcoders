"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createAuthHeaderConfig = exports.verifyHeader = exports.getSenderDetails = exports.verifyMessage = exports.createAuthorizationHeader = exports.signMessage = exports.createSigningString = exports.createKeyPair = void 0;
const libsodium_wrappers_1 = __importStar(require("libsodium-wrappers"));
const promises_1 = require("fs/promises");
const logger_utils_1 = __importDefault(require("./logger.utils"));
const lookup_utils_1 = require("./lookup.utils");
const exception_model_1 = require("../models/exception.model");
const config_utils_1 = require("./config.utils");
const createKeyPair = () => __awaiter(void 0, void 0, void 0, function* () {
    yield libsodium_wrappers_1.default.ready;
    const sodium = libsodium_wrappers_1.default;
    let { publicKey, privateKey } = sodium.crypto_sign_keypair();
    const publicKey_base64 = sodium.to_base64(publicKey, libsodium_wrappers_1.base64_variants.ORIGINAL);
    const privateKey_base64 = sodium.to_base64(privateKey, libsodium_wrappers_1.base64_variants.ORIGINAL);
    yield (0, promises_1.writeFile)("./publicKey.pem", publicKey_base64);
    yield (0, promises_1.writeFile)("./privateKey.pem", privateKey_base64);
});
exports.createKeyPair = createKeyPair;
const createSigningString = (message, created, expires) => __awaiter(void 0, void 0, void 0, function* () {
    //if (!created) created = Math.floor(new Date().getTime() / 1000).toString();
    if (!created)
        created = Math.floor(new Date().getTime() / 1000 - 1 * 60).toString(); //TO USE IN CASE OF TIME ISSUE
    if (!expires)
        expires = (parseInt(created) + 1 * 60 * 60).toString(); //Add required time to create expired
    //const digest = createBlakeHash('blake512').update(JSON.stringify(message)).digest("base64");
    //const digest = blake2.createHash('blake2b', { digestLength: 64 }).update(Buffer.from(message)).digest("base64");
    yield libsodium_wrappers_1.default.ready;
    const sodium = libsodium_wrappers_1.default;
    const digest = sodium.crypto_generichash(64, sodium.from_string(message));
    const digest_base64 = sodium.to_base64(digest, libsodium_wrappers_1.base64_variants.ORIGINAL);
    const signing_string = `(created): ${created}
(expires): ${expires}
digest: BLAKE-512=${digest_base64}`;
    logger_utils_1.default.info(`Signing String:==>\n${signing_string}\n\n`);
    return { signing_string, expires, created };
});
exports.createSigningString = createSigningString;
const signMessage = (signing_string, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    yield libsodium_wrappers_1.default.ready;
    const sodium = libsodium_wrappers_1.default;
    const signedMessage = sodium.crypto_sign_detached(signing_string, sodium.from_base64(privateKey, libsodium_wrappers_1.base64_variants.ORIGINAL));
    return sodium.to_base64(signedMessage, libsodium_wrappers_1.base64_variants.ORIGINAL);
});
exports.signMessage = signMessage;
const createAuthorizationHeader = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const { signing_string, expires, created } = yield (0, exports.createSigningString)(JSON.stringify(message));
    const signature = yield (0, exports.signMessage)(signing_string, (0, config_utils_1.getConfig)().app.privateKey || "");
    const subscriber_id = (0, config_utils_1.getConfig)().app.subscriberId;
    const header = `Signature keyId="${subscriber_id}|${(0, config_utils_1.getConfig)().app.uniqueKey}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;
    return header;
});
exports.createAuthorizationHeader = createAuthorizationHeader;
const verifyMessage = (signedString, signingString, publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield libsodium_wrappers_1.default.ready;
        const sodium = libsodium_wrappers_1.default;
        return sodium.crypto_sign_verify_detached(sodium.from_base64(signedString, libsodium_wrappers_1.base64_variants.ORIGINAL), signingString, sodium.from_base64(publicKey, libsodium_wrappers_1.base64_variants.ORIGINAL));
    }
    catch (error) {
        return false;
    }
});
exports.verifyMessage = verifyMessage;
const remove_quotes = (value) => {
    if (value.length >= 2 &&
        value.charAt(0) == '"' &&
        value.charAt(value.length - 1) == '"') {
        value = value.substring(1, value.length - 1);
    }
    return value;
};
const split_auth_header = (auth_header) => {
    const header = auth_header.replace("Signature ", "");
    let re = /\s*([^=]+)=([^,]+)[,]?/g;
    let m;
    let parts = {};
    while ((m = re.exec(header)) !== null) {
        if (m) {
            parts[m[1]] = remove_quotes(m[2]);
        }
    }
    return parts;
};
const split_auth_header_space = (auth_header) => {
    const header = auth_header.replace("Signature ", "");
    let re = /\s*([^=]+)=\"([^"]+)"/g;
    let m;
    let parts = {};
    while ((m = re.exec(header)) !== null) {
        if (m) {
            parts[m[1]] = m[2];
        }
    }
    return parts;
};
function getSenderDetails(header) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_utils_1.default.info(`Header recieved from bpp: ${JSON.stringify(header)}`);
            const parts = split_auth_header(header);
            if (!parts || Object.keys(parts).length === 0) {
                throw new Error("Header parsing failed");
            }
            const subscriber_id = parts["keyId"].split("|")[0];
            const unique_key_id = parts["keyId"].split("|")[1];
            const subscriber_details = yield (0, lookup_utils_1.getSubscriberDetails)(subscriber_id, unique_key_id);
            return subscriber_details;
        }
        catch (error) {
            logger_utils_1.default.error(error);
            throw error;
        }
    });
}
exports.getSenderDetails = getSenderDetails;
function verifyHeader(header, req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const parts = split_auth_header(header);
            if (!parts || Object.keys(parts).length === 0) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Authentication_HeaderParsingFailed, "Header parsing failed", 401);
            }
            const subscriber_id = parts["keyId"].split("|")[0];
            const unique_key_id = parts["keyId"].split("|")[1];
            const subscriber_details = yield (0, lookup_utils_1.getSubscriberDetails)(subscriber_id, unique_key_id);
            console.log((_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.transaction_id, subscriber_details);
            const public_key = subscriber_details.signing_public_key;
            const { signing_string } = yield (0, exports.createSigningString)(res.locals.rawBody, parts["created"], parts["expires"]);
            const verified = yield (0, exports.verifyMessage)(parts["signature"], signing_string, public_key);
            return verified;
        }
        catch (error) {
            logger_utils_1.default.error(error);
            return false;
        }
    });
}
exports.verifyHeader = verifyHeader;
const createAuthHeaderConfig = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const header = yield (0, exports.createAuthorizationHeader)(request);
    const axios_config = {
        headers: {
            authorization: header
        },
        timeout: (0, config_utils_1.getConfig)().app.httpTimeout
    };
    logger_utils_1.default.info(`Axios Config for Request:\n${JSON.stringify(axios_config)}\n\n`);
    return axios_config;
});
exports.createAuthHeaderConfig = createAuthHeaderConfig;
