"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MQClient = void 0;
const AmqbLib = __importStar(require("amqplib"));
const logger_utils_1 = __importDefault(require("./logger.utils"));
const exception_model_1 = require("../models/exception.model");
class MQClient {
    constructor(amqpUrl) {
        this.isConnected = false;
        this.channel = null;
        this.isConnected = false;
        this.amqpUrl = amqpUrl;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const connection = yield AmqbLib.connect(this.amqpUrl, {
                    heartbeat: 10
                });
                const tempChannel = yield connection.createChannel();
                this.channel = tempChannel;
                this.isConnected = true;
                logger_utils_1.default.info(`MQ Client Connected For: ${this.amqpUrl.split("@")[1].split(":")[0]}`);
            }
            catch (error) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.MQ_ConnectionFailed, `MQ Client Connection Failed For URL: ${this.amqpUrl}`, 500, error);
            }
        });
    }
    assertQueue(queue) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new exception_model_1.Exception(exception_model_1.ExceptionType.MQ_ClientNotInitialized, "MQ Client is not connected", 500);
            }
            yield this.channel.assertQueue(queue, {
                durable: true
            });
        });
    }
    publishMessage(queue, data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("MQ Client is not connected");
            }
            this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        });
    }
    consumeMessage(queue, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error("MQ Client is not connected");
            }
            this.channel.consume(queue, callback, {
                noAck: true
            });
        });
    }
}
exports.MQClient = MQClient;
