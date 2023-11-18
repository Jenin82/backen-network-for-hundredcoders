"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const exception_model_1 = require("../models/exception.model");
const config_schema_1 = require("../schemas/configs/config.schema");
const config = require("config");
let configuration;
const getConfig = () => {
    if (configuration) {
        return configuration;
    }
    configuration = (0, config_schema_1.parseConfig)(config);
    if (!configuration) {
        throw new exception_model_1.Exception(exception_model_1.ExceptionType.Config_NotFound, "Config file is not found.", 404);
    }
    return configuration;
};
exports.getConfig = getConfig;
