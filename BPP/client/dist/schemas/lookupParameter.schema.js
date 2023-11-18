"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupParameterSchema = void 0;
const zod_1 = require("zod");
const subscriberDetails_schema_1 = require("./subscriberDetails.schema");
exports.lookupParameterSchema = zod_1.z.object({
    subscriber_id: zod_1.z.string().optional().nullable(),
    unique_key_id: zod_1.z.string().optional().nullable(),
    type: zod_1.z.nativeEnum(subscriberDetails_schema_1.NetworkPaticipantType).optional().nullable(),
    domain: zod_1.z.string().optional().nullable(),
});
