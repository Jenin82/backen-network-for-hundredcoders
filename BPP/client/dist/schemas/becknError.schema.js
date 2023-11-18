"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.becknErrorSchema = exports.BecknErrorType = void 0;
const zod_1 = require("zod");
var BecknErrorType;
(function (BecknErrorType) {
    BecknErrorType["contextError"] = "CONTEXT-ERROR";
    BecknErrorType["coreError"] = "CORE-ERROR";
    BecknErrorType["domainError"] = "DOMAIN-ERROR";
    BecknErrorType["policyError"] = "POLICY-ERROR";
})(BecknErrorType = exports.BecknErrorType || (exports.BecknErrorType = {}));
exports.becknErrorSchema = zod_1.z.object({
    type: zod_1.z.nativeEnum(BecknErrorType),
    code: zod_1.z.number(),
    path: zod_1.z.string().optional(),
    message: zod_1.z.string(),
    data: zod_1.z.array(zod_1.z.any()).optional()
});
