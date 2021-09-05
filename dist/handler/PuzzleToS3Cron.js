"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Handler = void 0;
const XWordRenderSvc_1 = __importDefault(require("../service/XWordRenderSvc"));
const Handler = async (event) => {
    await (0, XWordRenderSvc_1.default)();
    return { "good": "job" };
};
exports.Handler = Handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHV6emxlVG9TM0Nyb24uanMiLCJzb3VyY2VSb290IjoiLyIsInNvdXJjZXMiOlsiaGFuZGxlci9QdXp6bGVUb1MzQ3Jvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSwrRUFBdUQ7QUFFdkQsTUFBTSxPQUFPLEdBQUcsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFFO0lBQzlCLE1BQU0sSUFBQSx3QkFBYyxHQUFFLENBQUE7SUFDdEIsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsQ0FBQztBQUMzQixDQUFDLENBQUE7QUFFUSwwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IFhXb3JkUmVuZGVyU3ZjIGZyb20gXCIuLi9zZXJ2aWNlL1hXb3JkUmVuZGVyU3ZjXCI7XG5cbmNvbnN0IEhhbmRsZXIgPSBhc3luYyAoZXZlbnQpID0+IHtcbiAgYXdhaXQgWFdvcmRSZW5kZXJTdmMoKVxuICByZXR1cm4geyBcImdvb2RcIjogXCJqb2JcIiB9O1xufVxuXG5leHBvcnQgeyBIYW5kbGVyIH0iXX0=