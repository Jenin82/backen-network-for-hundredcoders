"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = exports.ExceptionType = void 0;
var ExceptionType;
(function (ExceptionType) {
    ExceptionType["Cache_NotIntialized"] = "Cache_NotIntialized";
    ExceptionType["Config_NotFound"] = "Config_NotFound";
    ExceptionType["Config_ServerConfig_NotFound"] = "Config_ServerConfig_NotFound";
    ExceptionType["Config_ServerConfig_Invalid"] = "Config_ServerConfig_Invalid";
    ExceptionType["Config_CacheConfig_NotFound"] = "Config_CacheConfig_NotFound";
    ExceptionType["Config_CacheConfig_Invalid"] = "Config_CacheConfig_Invalid";
    ExceptionType["Config_ResponseCacheConfig_Invalid"] = "Config_ResponseCacheConfig_Invalid";
    ExceptionType["Config_ClientConfig_NotFound"] = "Config_ClientConfig_NotFound";
    ExceptionType["Config_ClientConfig_Invalid"] = "Config_ClientConfig_Invalid";
    ExceptionType["Config_SynchronousClientConfig_NotFound"] = "Config_SynchronousClientConfig_NotFound";
    ExceptionType["Config_SynchronousClientConfig_Invalid"] = "Config_SynchronousClientConfig_Invalid";
    ExceptionType["Config_WebhookClientConfig_NotFound"] = "Config_WebhookClientConfig_NotFound";
    ExceptionType["Config_WebhookClientConfig_Invalid"] = "Config_WebhookClientConfig_Invalid";
    ExceptionType["Config_MessageQueueClientConfig_NotFound"] = "Config_MessageQueueClientConfig_NotFound";
    ExceptionType["Config_MessageQueueClientConfig_Invalid"] = "Config_MessageQueueClientConfig_Invalid";
    ExceptionType["Config_GatewayAppConfig_NotFound"] = "Config_GatewayAppConfig_NotFound";
    ExceptionType["Config_GatewayAppConfig_Invalid"] = "Config_GatewayAppConfig_Invalid";
    ExceptionType["Config_ActionConfig_Invalid"] = "Config_ActionConfig_Invalid";
    ExceptionType["Config_ActionsAppConfig_NotFound"] = "Config_ActionsAppConfig_NotFound";
    ExceptionType["Config_ActionsAppConfig_Invalid"] = "Config_ActionsAppConfig_Invalid";
    ExceptionType["Config_AppConfig_NotFound"] = "Config_AppConfig_NotFound";
    ExceptionType["Config_AppConfig_Invalid"] = "Config_AppConfig_Invalid";
    ExceptionType["Config_BPPConfigurationInvalid"] = "Config_BPPConfigurationInvalid";
    ExceptionType["Config_BAPConfigurationInvalid"] = "Config_BAPConfigurationInvalid";
    ExceptionType["Authentication_HeaderParsingFailed"] = "Authentication_HeaderParsingFailed";
    ExceptionType["Context_NotFound"] = "Context_NotFound";
    ExceptionType["Context_DomainNotFound"] = "Context_DomainNotFound";
    ExceptionType["Context_CoreVersionNotFound"] = "Context_CoreVersionNotFound";
    ExceptionType["Context_ActionNotFound"] = "Context_ActionNotFound";
    ExceptionType["Context_TransactionIdNotFound"] = "Context_TransactionIdNotFound";
    ExceptionType["Context_MessageIdNotFound"] = "Context_MessageIdNotFound";
    ExceptionType["Registry_LookupError"] = "Registry_LookupError";
    ExceptionType["Registry_NoSubscriberFound"] = "Registry_NoSubscriberFound";
    ExceptionType["Mongo_URLNotFound"] = "Mongo_URLNotFound";
    ExceptionType["Mongo_ConnectionFailed"] = "Mongo_ConnectionFailed";
    ExceptionType["Mongo_ClientNotInitialized"] = "Mongo_ClientNotInitialized";
    ExceptionType["ResponseCache_NotEnabled"] = "ResponseCache_NotEnabled";
    ExceptionType["ResponseCache_NotInitialized"] = "ResponseCache_NotInitialized";
    ExceptionType["SyncCache_InvalidUse"] = "SyncCache_InvalidUse";
    ExceptionType["SyncCache_NotEnabled"] = "SyncCache_NotEnabled";
    ExceptionType["SyncCache_NotInitialized"] = "SyncCache_NotInitialized";
    ExceptionType["MQ_NotEnabled"] = "MQ_NotEnabled";
    ExceptionType["MQ_ClientNotInitialized"] = "MQ_ClientNotInitialized";
    ExceptionType["MQ_ConnectionFailed"] = "MQ_ConnectionFailed";
    ExceptionType["Gateway_InvalidUse"] = "Gateway_InvalidUse";
    ExceptionType["Client_InvalidCall"] = "Client_InvalidCall";
    ExceptionType["Client_CallbackFailed"] = "Client_CallbackFailed";
    ExceptionType["Client_MessageQueueFailed"] = "Client_MessageQueueFailed";
    ExceptionType["Client_SendSyncReponsesFailed"] = "Client_SendSyncReponsesFailed";
    ExceptionType["Client_SyncCacheDataNotFound"] = "Client_SyncCacheDataNotFound";
    ExceptionType["Acknowledgement_Failed"] = "Acknowledgement_Failed";
    ExceptionType["Request_Failed"] = "Request_Failed";
    ExceptionType["Response_Failed"] = "Response_Failed";
    ExceptionType["OpenApiSchema_ParsingError"] = "OpenApiSchema_ParsingError";
})(ExceptionType = exports.ExceptionType || (exports.ExceptionType = {}));
class Exception extends Error {
    constructor(type, message, code, errorData) {
        super(`${type}: ${message}\n ${errorData}`);
        this.message = message;
        this.code = code;
        this.type = type;
        this.errorData = errorData;
    }
    toString() {
        return `${this.type}: ${this.message}\n ${this.errorData}`;
    }
}
exports.Exception = Exception;
