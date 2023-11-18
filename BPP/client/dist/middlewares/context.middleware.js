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
exports.contextBuilderMiddleware = void 0;
const app_config_schema_1 = require("../schemas/configs/app.config.schema");
const config_utils_1 = require("../utils/config.utils");
const context_utils_1 = require("../utils/context.utils");
function contextBuilderMiddleware(req, res, next, action) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let context = null;
            switch ((0, config_utils_1.getConfig)().app.mode) {
                case app_config_schema_1.AppMode.bap: {
                    context = yield (0, context_utils_1.bapContextBuilder)(req.body.context, action);
                    break;
                }
                case app_config_schema_1.AppMode.bpp: {
                    context = (0, context_utils_1.bppContextBuilder)(req.body.context, action);
                    break;
                }
            }
            req.body.context = context;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.contextBuilderMiddleware = contextBuilderMiddleware;
