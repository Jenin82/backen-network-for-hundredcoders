"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncCacheSchema = void 0;
const zod_1 = require("zod");
const becknError_schema_1 = require("../becknError.schema");
const actions_app_config_schema_1 = require("../configs/actions.app.config.schema");
exports.syncCacheSchema = zod_1.z.object({
    message_id: zod_1.z.string(),
    action: zod_1.z.nativeEnum(actions_app_config_schema_1.RequestActions),
    responses: zod_1.z.array(zod_1.z.any()),
    error: becknError_schema_1.becknErrorSchema.optional()
});
