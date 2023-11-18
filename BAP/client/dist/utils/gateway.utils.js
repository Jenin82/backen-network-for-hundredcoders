"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GatewayUtils = void 0;
const bap_response_controller_1 = require("../controllers/bap.response.controller");
const bap_trigger_controller_1 = require("../controllers/bap.trigger.controller");
const bpp_request_controller_1 = require("../controllers/bpp.request.controller");
const bpp_response_controller_1 = require("../controllers/bpp.response.controller");
const exception_model_1 = require("../models/exception.model");
const app_config_schema_1 = require("../schemas/configs/app.config.schema");
const gateway_app_config_schema_1 = require("../schemas/configs/gateway.app.config.schema");
const config_utils_1 = require("./config.utils");
const rbtmq_utils_1 = require("./rbtmq.utils");
class GatewayUtils {
    constructor() {
        this.mqClient = new rbtmq_utils_1.MQClient((0, config_utils_1.getConfig)().app.gateway.amqpURL);
    }
    static getInstance() {
        if (!GatewayUtils.instance) {
            GatewayUtils.instance = new GatewayUtils();
        }
        return GatewayUtils.instance;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mqClient.connect();
            yield this.mqClient.assertQueue((0, config_utils_1.getConfig)().app.gateway.inboxQueue);
            yield this.mqClient.assertQueue((0, config_utils_1.getConfig)().app.gateway.outboxQueue);
            switch ((0, config_utils_1.getConfig)().app.gateway.mode) {
                case gateway_app_config_schema_1.GatewayMode.client: {
                    switch ((0, config_utils_1.getConfig)().app.mode) {
                        case app_config_schema_1.AppMode.bap: {
                            yield this.mqClient.consumeMessage((0, config_utils_1.getConfig)().app.gateway.inboxQueue, bap_response_controller_1.bapNetworkResponseSettler);
                            break;
                        }
                        case app_config_schema_1.AppMode.bpp: {
                            yield this.mqClient.consumeMessage((0, config_utils_1.getConfig)().app.gateway.inboxQueue, bpp_request_controller_1.bppNetworkRequestSettler);
                        }
                    }
                    break;
                }
                case gateway_app_config_schema_1.GatewayMode.network: {
                    switch ((0, config_utils_1.getConfig)().app.mode) {
                        case app_config_schema_1.AppMode.bap: {
                            yield this.mqClient.consumeMessage((0, config_utils_1.getConfig)().app.gateway.outboxQueue, bap_trigger_controller_1.bapClientTriggerSettler);
                            break;
                        }
                        case app_config_schema_1.AppMode.bpp:
                            {
                                yield this.mqClient.consumeMessage((0, config_utils_1.getConfig)().app.gateway.outboxQueue, bpp_response_controller_1.bppClientResponseSettler);
                                break;
                            }
                            break;
                    }
                }
            }
        });
    }
    sendToClientSideGateway(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().app.gateway.mode === gateway_app_config_schema_1.GatewayMode.client) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Gateway_InvalidUse, "Gateway is in client mode, cannot send data to client side gateway", 500);
            }
            yield this.mqClient.publishMessage((0, config_utils_1.getConfig)().app.gateway.inboxQueue, data);
        });
    }
    sendToNetworkSideGateway(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((0, config_utils_1.getConfig)().app.gateway.mode === gateway_app_config_schema_1.GatewayMode.network) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.Gateway_InvalidUse, "Gateway is in network mode, cannot send data to network side gateway", 500);
            }
            yield this.mqClient.publishMessage((0, config_utils_1.getConfig)().app.gateway.outboxQueue, data);
        });
    }
}
exports.GatewayUtils = GatewayUtils;
