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
exports.testController = void 0;
function testController(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        // // Request Cache Code.
        // const requestCache=RequestCache.getInstance();
        // const oldRequest=await requestCache.check(req.body.context.message_id, req.body.context.action);
        // console.log(oldRequest)
        // const requestData=parseRequestCache(
        //     req.body.context.transaction_id, 
        //     req.body.context.message_id, 
        //     req.body.context.action,
        //     res.locals.sender!, 
        //     undefined
        // );
        // const cacheResult=await requestCache.cache(requestData, getConfig().app.actions.requests.init!.ttl);
        // console.log(cacheResult);
        // // Request Cache Code End.
        res.status(200).json({
            message: {
                ack: {
                    status: "ACK"
                }
            }
        });
    });
}
exports.testController = testController;
