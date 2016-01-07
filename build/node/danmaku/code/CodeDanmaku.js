/**
 * Created by MIC on 2015/12/28.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DanmakuBase_1 = require("../DanmakuBase");
var DanmakuKind_1 = require("../DanmakuKind");
var Bulletproof_1 = require("../../Bulletproof");
var BiliBiliDanmakuApiContainer_1 = require("../../bilibili/BiliBiliDanmakuApiContainer");
var _util_1 = require("../../../lib/glantern/src/_util/_util");
var CodeDanmaku = (function (_super) {
    __extends(CodeDanmaku, _super);
    function CodeDanmaku(root, parent, layoutManager) {
        _super.call(this, root, parent, layoutManager);
        this._apiNames = null;
        this._apiContainer = null;
        this._content = null;
        this._lambda = null;
        this._bulletproof = null;
        this._bulletproof = this.layoutManager.danmakuProvider.danmakuCoordinator.bulletproof;
    }
    Object.defineProperty(CodeDanmaku.prototype, "danmakuKind", {
        get: function () {
            return DanmakuKind_1.DanmakuKind.Code;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CodeDanmaku.prototype, "layoutManager", {
        get: function () {
            return this._layoutManager;
        },
        enumerable: true,
        configurable: true
    });
    CodeDanmaku.prototype.getContent = function () {
        return this._content;
    };
    CodeDanmaku.prototype.getText = function () {
        // No readable text.
        return "";
    };
    CodeDanmaku.prototype.initialize = function (content, time) {
        this._content = content;
        this._apiContainer = new BiliBiliDanmakuApiContainer_1.BiliBiliDanmakuApiContainer(this);
        if (this.__censor()) {
            this._lambda = this.__buildFunction();
            this.__applyFunction();
        }
    };
    Object.defineProperty(CodeDanmaku.prototype, "lifeTime", {
        get: function () {
            return Bulletproof_1.Bulletproof.CODE_DANMAKU_LIFE_TIME;
        },
        enumerable: true,
        configurable: true
    });
    CodeDanmaku.prototype.__censor = function () {
        return true;
    };
    CodeDanmaku.prototype.__update = function () {
        this.__removeDeadDCObjects();
        this.__applyMotionGroups();
        //console.log("Time elapsed: ", this._bulletproof.timeElapsed);
    };
    CodeDanmaku.prototype.__render = function (renderer) {
        // Do nothing, let children render themselves.
    };
    CodeDanmaku.prototype.__buildFunction = function () {
        // Weak defense is better than none.
        // TODO: Use WebWorker to create a safety sandbox.
        var api = this._apiContainer.api;
        this._apiNames = [];
        for (var apiName in api) {
            this._apiNames.push(apiName);
        }
        var funcArgs = this._apiNames.concat(this._content);
        return Function.prototype.constructor.apply(Object.create(null), funcArgs);
    };
    CodeDanmaku.prototype.__applyFunction = function () {
        var ac = this._apiContainer;
        var apiValues = [];
        for (var i = 0; i < this._apiNames.length; ++i) {
            apiValues.push(ac.api[this._apiNames[i]]);
        }
        this._lambda.apply(null, apiValues);
    };
    CodeDanmaku.prototype.__applyMotionGroups = function () {
        var child;
        var time = this._bulletproof.timeElapsed;
        for (var i = 0; i < this._children.length; ++i) {
            child = this._children[i];
            if (child.isCreatedByDanmaku) {
                if (!_util_1._util.isUndefinedOrNull(child.createParams.motion)) {
                    CodeDanmaku.__applyMotion(child.createParams.motion, time);
                }
                else if (!_util_1._util.isUndefinedOrNull(child.createParams.motionGroup)) {
                    CodeDanmaku.__applyMotionGroup(child.createParams.motionGroup, time);
                }
            }
        }
    };
    CodeDanmaku.__applyMotionGroup = function (motionGroup, now) {
        var motion;
        if (!_util_1._util.isUndefinedOrNull(motionGroup)) {
            //console.log("Calculating: ", obj, " on ", now);
            for (var i = 0; i < motionGroup.length; ++i) {
                motion = motionGroup[i];
                CodeDanmaku.__applyMotion(motion, now);
            }
        }
    };
    CodeDanmaku.__applyMotion = function (motion, now) {
        var propertyNames = ["x", "y", "alpha", "rotationZ", "rotationY"];
        var motionAnimation;
        var relativeTime;
        var value;
        if (motion.createdTime <= now && now <= motion.createdTime + motion.maximumLifeTime) {
            for (var j = 0; j < propertyNames.length; ++j) {
                motionAnimation = motion[propertyNames[j]];
                if (!_util_1._util.isUndefinedOrNull(motionAnimation)) {
                    relativeTime = now - motion.createdTime;
                    if (!_util_1._util.isUndefinedOrNull(motionAnimation.startDelay)) {
                        relativeTime -= motionAnimation.startDelay;
                    }
                    if (relativeTime <= motionAnimation.lifeTime * 1000) {
                        // TODO: property 'repeat' is ignored here.
                        // TODO: easing usage is always interpreted as linear here.
                        value = motionAnimation.fromValue +
                            (motionAnimation.toValue - motionAnimation.fromValue) / (motionAnimation.lifeTime * 1000) * relativeTime;
                        motion.sourceObject[propertyNames[j]] = value;
                    }
                }
            }
        }
    };
    CodeDanmaku.prototype.__removeDeadDCObjects = function () {
        var bulletproof = this._bulletproof;
        var child;
        for (var i = 0; i < this._children.length; ++i) {
            child = this._children[i];
            if (child.isCreatedByDanmaku) {
                if (child.extraCreateParams.bornTime + child.createParams.lifeTime * 1000 < bulletproof.timeElapsed) {
                    this.removeChild(child);
                    child.dispose();
                    --i;
                }
            }
        }
    };
    return CodeDanmaku;
})(DanmakuBase_1.DanmakuBase);
exports.CodeDanmaku = CodeDanmaku;

//# sourceMappingURL=CodeDanmaku.js.map