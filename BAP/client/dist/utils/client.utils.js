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
exports.ClientUtils = void 0;
const client_config_schema_1 = require("../schemas/configs/client.config.schema");
const sync_cache_utils_1 = require("./cache/sync.cache.utils");
const config_utils_1 = require("./config.utils");
class ClientUtils {
    static initializeConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            const connectionType = (0, config_utils_1.getConfig)().client.type;
            switch (connectionType) {
                case client_config_schema_1.ClientConfigType.synchronous: {
                    yield sync_cache_utils_1.SyncCache.getInstance().initialize();
                    break;
                }
                case client_config_schema_1.ClientConfigType.webhook: {
                    break;
                }
                case client_config_schema_1.ClientConfigType.messageQueue: {
                    // TODO: initialize message queue.
                    break;
                }
            }
        });
    }
}
exports.ClientUtils = ClientUtils;
