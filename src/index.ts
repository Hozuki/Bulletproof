/**
 * Created by MIC on 2015/12/28.
 */

const VERSION = "Bulletproof/0.6.0-alpha (BiliBili, like BSE, like CCL, like Flash) HTML5/*";

export * from "./Bulletproof";

import * as bilibili from "./bilibili/index";
import * as danmaku from "./danmaku/index";
import * as interactive from "./interactive/index";
import {BulletproofConfig} from "./BulletproofConfig";

export {VERSION as version, bilibili, danmaku, interactive, BulletproofConfig as configuration};

export * from "../lib/glantern/src/glantern/index";
