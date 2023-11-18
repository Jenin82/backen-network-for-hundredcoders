"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCallbackSchema = void 0;
const zod_1 = require("zod");
exports.requestCallbackSchema = zod_1.z.object({
    context: zod_1.z.any(),
    message: zod_1.z.any()
});
