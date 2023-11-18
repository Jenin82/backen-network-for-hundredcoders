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
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonCompressorMiddleware = void 0;
function jsonCompressorMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // Here we are intentionally converting the raw body to req.body.
        // As we need to avoid the signature that can be caused due to the fact that
        // spaces and tabs in json body are left in the req.body even after the conversion to string.
        req.body = (res.locals.rawBody) ? JSON.parse(res.locals.rawBody) : null;
        next();
    });
}
exports.jsonCompressorMiddleware = jsonCompressorMiddleware;
