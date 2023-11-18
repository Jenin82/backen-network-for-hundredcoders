"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionUtils = void 0;
const zod_1 = require("zod");
const actions_app_config_schema_1 = require("../schemas/configs/actions.app.config.schema");
class ActionUtils {
    static getCorrespondingResponseAction(action) {
        switch (action) {
            case actions_app_config_schema_1.RequestActions.cancel:
                return actions_app_config_schema_1.ResponseActions.on_cancel;
            case actions_app_config_schema_1.RequestActions.confirm:
                return actions_app_config_schema_1.ResponseActions.on_confirm;
            case actions_app_config_schema_1.RequestActions.init:
                return actions_app_config_schema_1.ResponseActions.on_init;
            case actions_app_config_schema_1.RequestActions.rating:
                return actions_app_config_schema_1.ResponseActions.on_rating;
            case actions_app_config_schema_1.RequestActions.search:
                return actions_app_config_schema_1.ResponseActions.on_search;
            case actions_app_config_schema_1.RequestActions.select:
                return actions_app_config_schema_1.ResponseActions.on_select;
            case actions_app_config_schema_1.RequestActions.status:
                return actions_app_config_schema_1.ResponseActions.on_status;
            case actions_app_config_schema_1.RequestActions.support:
                return actions_app_config_schema_1.ResponseActions.on_support;
            case actions_app_config_schema_1.RequestActions.track:
                return actions_app_config_schema_1.ResponseActions.on_track;
            case actions_app_config_schema_1.RequestActions.update:
                return actions_app_config_schema_1.ResponseActions.on_update;
            case actions_app_config_schema_1.RequestActions.get_cancellation_reasons:
                return actions_app_config_schema_1.ResponseActions.cancellation_reasons;
            case actions_app_config_schema_1.RequestActions.get_rating_categories:
                return actions_app_config_schema_1.ResponseActions.rating_categories;
        }
    }
    static getCorrespondingRequestAction(action) {
        switch (action) {
            case actions_app_config_schema_1.ResponseActions.on_cancel:
                return actions_app_config_schema_1.RequestActions.cancel;
            case actions_app_config_schema_1.ResponseActions.on_confirm:
                return actions_app_config_schema_1.RequestActions.confirm;
            case actions_app_config_schema_1.ResponseActions.on_init:
                return actions_app_config_schema_1.RequestActions.init;
            case actions_app_config_schema_1.ResponseActions.on_rating:
                return actions_app_config_schema_1.RequestActions.rating;
            case actions_app_config_schema_1.ResponseActions.on_search:
                return actions_app_config_schema_1.RequestActions.search;
            case actions_app_config_schema_1.ResponseActions.on_select:
                return actions_app_config_schema_1.RequestActions.select;
            case actions_app_config_schema_1.ResponseActions.on_status:
                return actions_app_config_schema_1.RequestActions.status;
            case actions_app_config_schema_1.ResponseActions.on_support:
                return actions_app_config_schema_1.RequestActions.support;
            case actions_app_config_schema_1.ResponseActions.on_track:
                return actions_app_config_schema_1.RequestActions.track;
            case actions_app_config_schema_1.ResponseActions.on_update:
                return actions_app_config_schema_1.RequestActions.update;
            case actions_app_config_schema_1.ResponseActions.cancellation_reasons:
                return actions_app_config_schema_1.RequestActions.get_cancellation_reasons;
            case actions_app_config_schema_1.ResponseActions.rating_categories:
                return actions_app_config_schema_1.RequestActions.get_rating_categories;
        }
    }
    static parseAction(action) {
        const actionSchema = zod_1.z.union([
            zod_1.z.nativeEnum(actions_app_config_schema_1.RequestActions),
            zod_1.z.nativeEnum(actions_app_config_schema_1.ResponseActions)
        ]);
        return actionSchema.parse(action);
    }
}
exports.ActionUtils = ActionUtils;
