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
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiValidatorMiddleware = exports.schemaErrorHandler = void 0;
const OpenApiValidator = __importStar(require("express-openapi-validator"));
const exception_model_1 = require("../models/exception.model");
const schemaErrorHandler = (err, req, res, next) => {
    if (err instanceof exception_model_1.Exception) {
        next(err);
    }
    else {
        const errorData = new exception_model_1.Exception(exception_model_1.ExceptionType.OpenApiSchema_ParsingError, "OpenApiValidator Error", err.status, err);
        next(errorData);
    }
};
exports.schemaErrorHandler = schemaErrorHandler;
const openApiValidatorMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const version = ((_b = (_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.context) === null || _b === void 0 ? void 0 : _b.core_version)
        ? (_d = (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.context) === null || _d === void 0 ? void 0 : _d.core_version
        : (_f = (_e = req === null || req === void 0 ? void 0 : req.body) === null || _e === void 0 ? void 0 : _e.context) === null || _f === void 0 ? void 0 : _f.version;
    const openApiValidator = OpenApiValidator.middleware({
        apiSpec: `schemas/core_${version}.yaml`,
        validateRequests: true,
        validateResponses: false,
        $refParser: {
            mode: "dereference"
        }
    });
    const walkSubstack = function (stack, req, res, next) {
        if (typeof stack === "function") {
            stack = [stack];
        }
        const walkStack = function (i, err) {
            if (err) {
                return (0, exports.schemaErrorHandler)(err, req, res, next);
            }
            if (i >= stack.length) {
                return next();
            }
            stack[i](req, res, walkStack.bind(null, i + 1));
        };
        walkStack(0);
    };
    walkSubstack([...openApiValidator], req, res, next);
});
exports.openApiValidatorMiddleware = openApiValidatorMiddleware;
