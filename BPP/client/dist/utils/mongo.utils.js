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
exports.DBClient = void 0;
const mongodb_1 = require("mongodb");
const exception_model_1 = require("../models/exception.model");
const logger_utils_1 = __importDefault(require("./logger.utils"));
class DBClient {
    constructor(dbURL) {
        this.isConnected = false;
        this.client = new mongodb_1.MongoClient(dbURL, {
            minPoolSize: 10,
            maxPoolSize: 15,
        });
        this.db = this.client.db();
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            this.client = yield this.client.connect();
            this.db = this.client.db();
            this.isConnected = true;
            logger_utils_1.default.info(`Mongo Client Connected For DB: ${this.db.databaseName}`);
        });
    }
    getDB() {
        if (!this.isConnected) {
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not connected.", 500);
        }
        return this.db;
    }
    getClient() {
        if (!this.isConnected) {
            throw new exception_model_1.Exception(exception_model_1.ExceptionType.Mongo_ClientNotInitialized, "Mongo client is not connected.", 500);
        }
        return this.client;
    }
}
exports.DBClient = DBClient;
