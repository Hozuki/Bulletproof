/**
 * Created by MIC on 2016/1/7.
 */
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BiliBiliDamakuApiObject_1 = require("./BiliBiliDamakuApiObject");
var NotImplementedError_1 = require("../../../lib/glantern/src/_util/NotImplementedError");
var _util_1 = require("../../../lib/glantern/src/_util/_util");
var VideoPlayerState_1 = require("../../interactive/video/VideoPlayerState");
var PlayerState_1 = require("./PlayerState");
var Player = (function (_super) {
    __extends(Player, _super);
    function Player(apiContainer) {
        _super.call(this, apiContainer);
        this._videoPlayer = null;
        this._videoPlayer = this.apiContainer.bulletproof.videoPlayer;
    }
    Player.prototype.play = function () {
        this._videoPlayer.play();
    };
    Player.prototype.pause = function () {
        this._videoPlayer.pause();
    };
    Player.prototype.seek = function (offset) {
        this._videoPlayer.currentTime = offset;
    };
    Player.prototype.jump = function (av, page, newWindow) {
        if (page === void 0) { page = 1; }
        if (newWindow === void 0) { newWindow = false; }
        var url = _util_1._util.formatString("http://www.bilibili.com/video/{0}/index_{1}.html", av, page);
        if (newWindow) {
            window.open(url, "_blank");
        }
        else {
            window.location.assign(url);
        }
    };
    Object.defineProperty(Player.prototype, "state", {
        get: function () {
            var state = this._videoPlayer.state;
            switch (state) {
                case VideoPlayerState_1.VideoPlayerState.Playing:
                case VideoPlayerState_1.VideoPlayerState.Seeking:
                    return PlayerState_1.PlayerState.PLAYING;
                case VideoPlayerState_1.VideoPlayerState.Paused:
                    return PlayerState_1.PlayerState.PAUSE;
                case VideoPlayerState_1.VideoPlayerState.Created:
                case VideoPlayerState_1.VideoPlayerState.Initialized:
                case VideoPlayerState_1.VideoPlayerState.Loaded:
                case VideoPlayerState_1.VideoPlayerState.Stopped:
                    return PlayerState_1.PlayerState.STOP;
                default:
                    return PlayerState_1.PlayerState.INVALID;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "time", {
        get: function () {
            return this.apiContainer.bulletproof.timeElapsed;
        },
        enumerable: true,
        configurable: true
    });
    Player.prototype.commentTrigger = function (f, timeout) {
        if (timeout === void 0) { timeout = 1000; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Player.prototype.keyTrigger = function (f, timeout, up) {
        if (timeout === void 0) { timeout = 1000; }
        if (up === void 0) { up = false; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Player.prototype.setMask = function (obj) {
        throw new NotImplementedError_1.NotImplementedError();
    };
    Player.prototype.createSound = function (t, onLoad) {
        if (onLoad === void 0) { onLoad = null; }
        throw new NotImplementedError_1.NotImplementedError();
    };
    Object.defineProperty(Player.prototype, "commentList", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "refreshRate", {
        get: function () {
            return 1 / this.apiContainer.bulletproof.fps;
        },
        set: function (v) {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "width", {
        get: function () {
            return this.apiContainer.bulletproof.stage.stageWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "height", {
        get: function () {
            return this.apiContainer.bulletproof.stage.stageHeight;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "videoWidth", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Player.prototype, "videoHeight", {
        get: function () {
            throw new NotImplementedError_1.NotImplementedError();
        },
        enumerable: true,
        configurable: true
    });
    return Player;
})(BiliBiliDamakuApiObject_1.BiliBiliDamakuApiObject);
exports.Player = Player;

//# sourceMappingURL=Player.js.map
