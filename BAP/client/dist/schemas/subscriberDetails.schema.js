"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriberDetailsSchema = exports.NetworkPaticipantType = void 0;
const zod_1 = require("zod");
var NetworkPaticipantType;
(function (NetworkPaticipantType) {
    NetworkPaticipantType["BAP"] = "BAP";
    NetworkPaticipantType["BPP"] = "BPP";
    NetworkPaticipantType["BG"] = "BG";
    NetworkPaticipantType["BREG"] = "BREG";
})(NetworkPaticipantType = exports.NetworkPaticipantType || (exports.NetworkPaticipantType = {}));
exports.subscriberDetailsSchema = zod_1.z.object({
    "subscriber_id": zod_1.z.string(),
    "subscriber_url": zod_1.z.string(),
    "type": zod_1.z.nativeEnum(NetworkPaticipantType),
    "signing_public_key": zod_1.z.string(),
    "valid_until": zod_1.z.string(),
});
