"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseRequestCache = exports.RequestCacheSchema = void 0;
const zod_1 = require("zod");
const actions_app_config_schema_1 = require("../configs/actions.app.config.schema");
const subscriberDetails_schema_1 = require("../subscriberDetails.schema");
exports.RequestCacheSchema = zod_1.z.object({
    transaction_id: zod_1.z.string(),
    message_id: zod_1.z.string(),
    action: zod_1.z.nativeEnum(actions_app_config_schema_1.RequestActions),
    requestType: zod_1.z.nativeEnum(actions_app_config_schema_1.RequestType),
    sender: subscriberDetails_schema_1.subscriberDetailsSchema
});
// Take sender details from the request object
const parseRequestCache = (transaction_id, message_id, action, sender, gatewayHeader) => {
    return exports.RequestCacheSchema.parse({
        transaction_id: transaction_id,
        message_id: message_id,
        action: action,
        requestType: ((gatewayHeader) && (gatewayHeader != "")) ? actions_app_config_schema_1.RequestType.broadcast : actions_app_config_schema_1.RequestType.direct,
        sender: sender
    });
};
exports.parseRequestCache = parseRequestCache;
