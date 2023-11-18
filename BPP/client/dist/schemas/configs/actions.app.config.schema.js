"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseActionsAppConfig = exports.actionsAppConfigSchema = exports.RequestType = exports.ResponseActions = exports.RequestActions = void 0;
const zod_1 = require("zod");
const exception_model_1 = require("../../models/exception.model");
const actionConfig_schema_1 = require("./actionConfig.schema");
var RequestActions;
(function (RequestActions) {
    RequestActions["search"] = "search";
    RequestActions["select"] = "select";
    RequestActions["init"] = "init";
    RequestActions["confirm"] = "confirm";
    RequestActions["update"] = "update";
    RequestActions["status"] = "status";
    RequestActions["track"] = "track";
    RequestActions["cancel"] = "cancel";
    RequestActions["rating"] = "rating";
    RequestActions["support"] = "support";
    RequestActions["get_cancellation_reasons"] = "get_cancellation_reasons";
    RequestActions["get_rating_categories"] = "get_rating_categories";
})(RequestActions = exports.RequestActions || (exports.RequestActions = {}));
var ResponseActions;
(function (ResponseActions) {
    ResponseActions["on_search"] = "on_search";
    ResponseActions["on_select"] = "on_select";
    ResponseActions["on_init"] = "on_init";
    ResponseActions["on_confirm"] = "on_confirm";
    ResponseActions["on_update"] = "on_update";
    ResponseActions["on_status"] = "on_status";
    ResponseActions["on_track"] = "on_track";
    ResponseActions["on_cancel"] = "on_cancel";
    ResponseActions["on_rating"] = "on_rating";
    ResponseActions["on_support"] = "on_support";
    ResponseActions["cancellation_reasons"] = "cancellation_reasons";
    ResponseActions["rating_categories"] = "rating_categories";
})(ResponseActions = exports.ResponseActions || (exports.ResponseActions = {}));
var RequestType;
(function (RequestType) {
    RequestType["broadcast"] = "broadcast";
    RequestType["direct"] = "direct";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
exports.actionsAppConfigSchema = zod_1.z.object({
    requests: zod_1.z.object({
        [RequestActions.search]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.select]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.init]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.confirm]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.update]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.status]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.track]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.cancel]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.rating]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.support]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.get_cancellation_reasons]: actionConfig_schema_1.actionConfigSchema.optional(),
        [RequestActions.get_rating_categories]: actionConfig_schema_1.actionConfigSchema.optional()
    }),
    responses: zod_1.z.object({
        [ResponseActions.on_search]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_select]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_init]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_confirm]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_update]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_status]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_track]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_cancel]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_rating]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.on_support]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.cancellation_reasons]: actionConfig_schema_1.actionConfigSchema.optional(),
        [ResponseActions.rating_categories]: actionConfig_schema_1.actionConfigSchema.optional()
    }),
});
const parseActionsAppConfig = (config) => {
    if (!config) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ActionsAppConfig_Invalid, "Actions not found", 404);
    }
    try {
        const actionsAppConfig = exports.actionsAppConfigSchema.parse(config);
        return actionsAppConfig;
    }
    catch (error) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_ActionsAppConfig_Invalid, "Invalid actions config", 400, error);
    }
};
exports.parseActionsAppConfig = parseActionsAppConfig;
