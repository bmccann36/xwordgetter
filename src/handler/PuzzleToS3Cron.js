"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const Handler = async (event) => {
    console.log(event);
    return { "good": "job" };
};
exports.Handler = Handler;
