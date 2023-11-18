"use strict";
// Create client config schema with config type.
// Create a parser function which will decide the client config type.
// Follow the priority order.
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseClientConfig = exports.clientConfigSchema = exports.parseMessageQueueClientConfig = exports.parseWebhookClientConfig = exports.parseSynchronousClientConfig = exports.ClientConfigType = void 0;
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
var ClientConfigType;
(function (ClientConfigType) {
    ClientConfigType["synchronous"] = "synchronous";
    ClientConfigType["webhook"] = "webhook";
    ClientConfigType["messageQueue"] = "messageQueue";
})(ClientConfigType = exports.ClientConfigType || (exports.ClientConfigType = {}));
const syncrhonousClientConfigSchema = zod_1.z.object({
    mongoURL: zod_1.z.string(),
});
const parseSynchronousClientConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_SynchronousClientConfig_NotFound, "Synchronous client config not found", 404);
    }
    try {
        return syncrhonousClientConfigSchema.parse(config);
    }
    catch (e) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_SynchronousClientConfig_Invalid, "Invalid synchronous client config", 400, e);
    }
};
exports.parseSynchronousClientConfig = parseSynchronousClientConfig;
const webhookClientSchema = zod_1.z.object({
    url: zod_1.z.string(),
});
const parseWebhookClientConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_WebhookClientConfig_NotFound, "Webhook client config not found", 404);
    }
    try {
        return webhookClientSchema.parse(config);
    }
    catch (e) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_WebhookClientConfig_Invalid, "Invalid webhook client config", 400, e);
    }
};
exports.parseWebhookClientConfig = parseWebhookClientConfig;
const messageQueueClientSchema = zod_1.z.object({
    amqpURL: zod_1.z.string(),
    incomingQueue: zod_1.z.string(),
    outgoingQueue: zod_1.z.string(),
});
const parseMessageQueueClientConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_MessageQueueClientConfig_NotFound, "Message queue client config not found", 404);
    }
    try {
        return messageQueueClientSchema.parse(config);
    }
    catch (e) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_MessageQueueClientConfig_Invalid, "Invalid message queue client config", 400, e);
    }
};
exports.parseMessageQueueClientConfig = parseMessageQueueClientConfig;
exports.clientConfigSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(ClientConfigType),
    connection: zod_1.z.union([
        syncrhonousClientConfigSchema,
        webhookClientSchema,
        messageQueueClientSchema,
    ]),
});
const parseClientConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ClientConfig_NotFound, "Client config not found", 404);
    }
    if (Object.keys(config).length === 0) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ClientConfig_Invalid, "Not even one type of Client Configuration is found.", 400);
    }
    if (Object.keys(config).length > 1) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ClientConfig_Invalid, "More than one type of Client Configuration found.", 400);
    }
    if (config['synchronous']) {
        return {
            type: ClientConfigType.synchronous,
            connection: (0, exports.parseSynchronousClientConfig)(config['synchronous']),
        };
    }
    else if (config['webhook']) {
        return {
            type: ClientConfigType.webhook,
            connection: (0, exports.parseWebhookClientConfig)(config['webhook']),
        };
    }
    else if (config['messageQueue']) {
        return {
            type: ClientConfigType.messageQueue,
            connection: (0, exports.parseMessageQueueClientConfig)(config['messageQueue']),
        };
    }
    else {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ClientConfig_Invalid, "Invalid client config", 400);
    }
};
exports.parseClientConfig = parseClientConfig;
