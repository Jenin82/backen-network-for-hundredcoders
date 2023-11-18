"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseConfig = exports.configSchema = void 0;
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
const app_config_schema_1 = require("./app.config.schema");
const cache_config_schema_1 = require("./cache.config.schema");
const client_config_schema_1 = require("./client.config.schema");
const response_cache_config_schema_1 = require("./response.cache.config.schema");
const server_config_schema_1 = require("./server.config.schema");
// Create the schema for the config file using other config schemas.
// Create a parser function which will do the following.
// 1. Parse the config file and return the config object.
// 2. checks for the app mode, in case BPP then synchronous is not an option (throw error).
// 3. checks for the required fields, in case not present then throw error.
//      Required fields are :
//      server, cache, client, app
exports.configSchema = zod_1.z.object({
    server: server_config_schema_1.serverConfigSchema,
    cache: cache_config_schema_1.cacheConfigSchema,
    responseCache: response_cache_config_schema_1.responseCacheConfigSchema,
    client: client_config_schema_1.clientConfigSchema,
    app: app_config_schema_1.appConfigSchema,
});
const parseConfig = (config) => {
    const serverConfig = (0, server_config_schema_1.parseServerConfig)(config.server);
    const cacheConfig = (0, cache_config_schema_1.parseCacheConfig)(config.cache);
    const responseCacheConfig = (0, response_cache_config_schema_1.parseResponseCacheConfig)(config.responseCache);
    const clientConfig = (0, client_config_schema_1.parseClientConfig)(config.client);
    const appConfig = (0, app_config_schema_1.parseAppConfig)(config.app);
    const configObject = {
        server: serverConfig,
        cache: cacheConfig,
        responseCache: responseCacheConfig,
        client: clientConfig,
        app: appConfig,
    };
    if (configObject.app.mode === app_config_schema_1.AppMode.bpp) {
        if (configObject.client.type === client_config_schema_1.ClientConfigType.synchronous) {
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_BPPConfigurationInvalid, "BPP configuration is invalid, synchronous is not an option for BPP Mode.", 400);
        }
    }
    return configObject;
};
exports.parseConfig = parseConfig;
