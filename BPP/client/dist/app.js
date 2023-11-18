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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exception_model_1 = require("./models/exception.model");
const becknError_schema_1 = require("./schemas/becknError.schema");
const lookup_cache_utils_1 = require("./utils/cache/lookup.cache.utils");
const request_cache_utils_1 = require("./utils/cache/request.cache.utils");
const response_cache_utils_1 = require("./utils/cache/response.cache.utils");
const client_utils_1 = require("./utils/client.utils");
const config_utils_1 = require("./utils/config.utils");
const gateway_utils_1 = require("./utils/gateway.utils");
const logger_utils_1 = __importDefault(require("./utils/logger.utils"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const initializeExpress = (successCallback) => __awaiter(void 0, void 0, void 0, function* () {
    const app = (0, express_1.default)();
    // Middleware for request body conversion to json and raw body creation.
    app.use(express_1.default.json({
        verify: (req, res, buf) => {
            res.locals = {
                rawBody: buf.toString()
            };
        }
    }));
    // Request Logger.
    app.use('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        //logger.info(JSON.stringify(req.body));
        next();
    }));
    // Test Routes
    const testRouter = require('./routes/test.routes').default;
    app.use('/test', testRouter);
    // Requests Routing.
    const { requestsRouter } = require('./routes/requests.routes');
    app.use('/', requestsRouter);
    // Response Routing.
    const { responsesRouter } = require('./routes/responses.routes');
    app.use('/', responsesRouter);
    // Error Handler.
    app.use((err, req, res, next) => {
        console.log(err);
        if (err instanceof exception_model_1.Exception) {
            const errorData = {
                code: err.code,
                message: err.message,
                data: err.errorData,
                type: becknError_schema_1.BecknErrorType.domainError
            };
            res.status(err.code).json({
                message: {
                    ack: {
                        status: "NACK"
                    }
                },
                error: errorData
            });
        }
        else {
            res.status(err.code || 500).json({
                message: {
                    ack: {
                        status: "NACK"
                    }
                },
                error: err
            });
        }
    });
    const PORT = (0, config_utils_1.getConfig)().server.port;
    app.listen(PORT, () => {
        logger_utils_1.default.info('Protocol Server started on PORT : ' + PORT);
        successCallback();
    });
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client_utils_1.ClientUtils.initializeConnection();
        yield gateway_utils_1.GatewayUtils.getInstance().initialize();
        if ((0, config_utils_1.getConfig)().responseCache.enabled) {
            yield response_cache_utils_1.ResponseCache.getInstance().initialize();
        }
        yield lookup_cache_utils_1.LookupCache.getInstance().initialize();
        yield request_cache_utils_1.RequestCache.getInstance().initialize();
        yield initializeExpress(() => {
            logger_utils_1.default.info("Protocol Server Started Successfully");
            logger_utils_1.default.info("Mode: " + (0, config_utils_1.getConfig)().app.mode.toLocaleUpperCase());
            logger_utils_1.default.info("Gateway Type: " + (0, config_utils_1.getConfig)().app.gateway.mode.toLocaleUpperCase().substring(0, 1) + (0, config_utils_1.getConfig)().app.gateway.mode.toLocaleUpperCase().substring(1));
        });
    }
    catch (err) {
        if (err instanceof exception_model_1.Exception) {
            logger_utils_1.default.error(err.toString());
        }
        else {
            logger_utils_1.default.error(err);
        }
    }
});
main();
