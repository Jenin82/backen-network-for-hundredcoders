"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becknResponseSchema = void 0;
const zod_1 = require("zod");
exports.becknResponseSchema = zod_1.z.object({
    status: zod_1.z.number({
        required_error: "Status is required..."
    }),
    data: zod_1.z.string({
        required_error: "Response Data is required..."
    })
});
