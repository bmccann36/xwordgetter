
import XWordRenderSvc from "../service/XWordRenderSvc";

const Handler = async (event) => {
  await XWordRenderSvc()
  return { "good": "job" };
}

export { Handler }