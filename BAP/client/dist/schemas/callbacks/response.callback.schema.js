"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseCallbackSchema = void 0;
const zod_1 = require("zod");
const becknError_schema_1 = require("../becknError.schema");
exports.responseCallbackSchema = zod_1.z.object({
    context: zod_1.z.any(),
    message: zod_1.z.any(),
    error: becknError_schema_1.becknErrorSchema.optional()
});
