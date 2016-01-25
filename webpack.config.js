/*Config配置*/
import ENV_CONFIG from "./scripts/config/env.config.js";
import PLATFORM_CONFIG from "./scripts/config/platform.config.js";

let platform = process.env.PLATFORM||"hybrid";//平台,hybrid or html5
let BUILD_VERSION = process.env.BUILD_VERSION||"product";//product or debug
let ENV = ENV_CONFIG[BUILD_VERSION];//全局变量配置文件
let WEBPACK_CONFIG =PLATFORM_CONFIG[platform](ENV)[BUILD_VERSION];//平台配置文件
export default WEBPACK_CONFIG;