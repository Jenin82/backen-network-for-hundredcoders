"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const test_controller_1 = require("../controllers/test.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const testRouter = (0, express_1.Router)();
testRouter.post('/', auth_middleware_1.authValidatorMiddleware, test_controller_1.testController);
exports.default = testRouter;
