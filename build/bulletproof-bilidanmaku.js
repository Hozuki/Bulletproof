/**
 * Created by MIC on 2015/8/27.
 */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../include/bulletproof-flash.d.ts"/>
/// <reference path="../include/bulletproof-bilidanmaku.d.ts"/>
/// <reference path="../include/bulletproof-fl.d.ts"/>
/// <reference path="../include/bulletproof-mic.d.ts"/>
/// <reference path="../include/bulletproof-org.d.ts"/>
/// <reference path="../include/bulletproof-data-interface.d.ts"/>
/// <reference path="../include/bulletproof-mx.d.ts"/>
/// <reference path="../include/bulletproof.d.ts"/>
var bulletproof_main = require("./bulletproof");
var bulletproof_flash = require("./bulletproof-flash");
var bulletproof_org = require("./bulletproof-org");
var bulletproof_mic = require("./bulletproof-mic");
var bulletproof_fl = require("./bulletproof-fl");
var bulletproof_mx = require("./bulletproof-mx");
var bulletproof;
(function (bulletproof) {
    var flash = bulletproof_flash.bulletproof.flash;
    var mic = bulletproof_mic.bulletproof.mic;
    var fl = bulletproof_fl.bulletproof.fl;
    var mx = bulletproof_mx.bulletproof.mx;
    var NotImplementedError = bulletproof_org.bulletproof.NotImplementedError;
    var Bulletproof = bulletproof_main.bulletproof.Bulletproof;
    var AdvancedDanamaku = (function () {
        function AdvancedDanamaku() {
        }
        Object.defineProperty(AdvancedDanamaku, "startParams", {
            get: function () {
                return AdvancedDanamaku._startParams;
            },
            enumerable: true,
            configurable: true
        });
        AdvancedDanamaku.initialize = function (root, video) {
            var stage = new flash.display.Stage(root);
            AdvancedDanamaku._startParams = {
                root: root,
                startDate: new Date(),
                video: video,
                bp: Bulletproof.instance,
                stage: stage
            };
            AdvancedDanamaku._startParams.bp.addEventListener(Bulletproof.RENDER_REQUESTED, function (event) {
                stage.raiseEnterFrame();
                AdvancedDanamaku.calculateMotionGroups();
                stage.redraw();
            });
        };
        AdvancedDanamaku.start = function () {
            AdvancedDanamaku._startParams.bp.enterMainLoop();
        };
        AdvancedDanamaku.registerMotion = function (motion) {
            if (AdvancedDanamaku._objectMotions.indexOf(motion) < 0) {
                AdvancedDanamaku._objectMotions.push(motion);
            }
        };
        AdvancedDanamaku.clearMotions = function () {
            while (AdvancedDanamaku._objectMotions.length > 0) {
                AdvancedDanamaku._objectMotions.pop();
            }
        };
        AdvancedDanamaku.calculateMotionGroups = function () {
            var propertyNames = ['x', 'y', 'alpha', 'rotationZ', 'rotationY'];
            var motionCount = AdvancedDanamaku._objectMotions.length;
            //var now = this._bdg.getTimer();
            var now = bilidanmaku.getTimer();
            var relativeTime;
            var motion;
            var motionAnimation;
            var value;
            for (var i = 0; i < motionCount; i++) {
                motion = AdvancedDanamaku._objectMotions[i];
                if (motion.createdTime <= now && now <= motion.createdTime + motion.maximumLifeTime) {
                    for (var j = 0; j < 5; j++) {
                        motionAnimation = motion[propertyNames[j]];
                        if (motionAnimation) {
                            relativeTime = now - motion.createdTime;
                            if (motionAnimation.startDelay) {
                                relativeTime -= motionAnimation.startDelay;
                            }
                            if (relativeTime <= motionAnimation.lifeTime * 1000) {
                                // TODO: 这里忽略了 repeat 属性
                                // TODO: 应该使用指定的 easing 方法，没有则假设线性；这里假设线性
                                value = motionAnimation.fromValue + (motionAnimation.toValue - motionAnimation.fromValue) / (motionAnimation.lifeTime * 1000) * relativeTime;
                                motion.sourceObject[propertyNames[j]] = value;
                            }
                        }
                    }
                }
            }
        };
        AdvancedDanamaku.debugLogMotions = function () {
            console.log(AdvancedDanamaku._objectMotions);
        };
        AdvancedDanamaku._objectMotions = [];
        return AdvancedDanamaku;
    })();
    bulletproof.AdvancedDanamaku = AdvancedDanamaku;
    var ProofObject = (function () {
        function ProofObject() {
        }
        Object.defineProperty(ProofObject, "version", {
            get: function () {
                return 'Bulletproof/0.1.0 (BiliBili, like BSE, like CCL, like Flash) HTML5/*';
            },
            enumerable: true,
            configurable: true
        });
        return ProofObject;
    })();
    bulletproof.ProofObject = ProofObject;
    /*
     export class AdvAdapter {

     private static _initialized:boolean = false;
     private static _instance:AdvAdapter;
     private _startParams:IProofStartParams;

     public static get instance():AdvAdapter {
     return AdvAdapter._instance;
     }

     public get startParams():IProofStartParams {
     return this._startParams;
     }

     public static initialize(root:HTMLDivElement, video:HTMLVideoElement, bp:Bulletproof):AdvAdapter {
     if (!AdvAdapter._initialized) {
     var adapter = new AdvAdapter();
     adapter._startParams = {
     root: root,
     startDate: new Date(),
     video: video,
     bp: bp
     };
     AdvAdapter._instance = adapter;
     }
     return AdvAdapter._instance;
     }

     public getTimer():number {
     return bilidanmaku.getTimer();
     }

     public getModule():any {
     return bilidanmaku;
     }

     }
     */
    var bilidanmaku;
    (function (bilidanmaku) {
        var Display = (function (_super) {
            __extends(Display, _super);
            function Display() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(Display, "fullScreenWidth", {
                get: function () {
                    return screen.width;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Display, "fullScreenHeight", {
                get: function () {
                    return screen.height;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Display, "width", {
                get: function () {
                    return AdvancedDanamaku.startParams.root.clientWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Display, "height", {
                get: function () {
                    return AdvancedDanamaku.startParams.root.clientHeight;
                },
                enumerable: true,
                configurable: true
            });
            Display.createMatrix = function (a, b, c, d, tx, ty) {
                if (a === void 0) { a = 1; }
                if (b === void 0) { b = 0; }
                if (c === void 0) { c = 1; }
                if (d === void 0) { d = 1; }
                if (tx === void 0) { tx = 0; }
                if (ty === void 0) { ty = 0; }
                return new flash.geom.Matrix(a, b, c, d, tx, ty);
            };
            Display.createPoint = function (x, y) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                return new flash.geom.Point(x, y);
            };
            Display.createComment = function (text, params) {
                var comment = new CommentField(Display.root, Display.root, params);
                comment.text = text;
                return comment;
            };
            Display.createShape = function (params) {
                var shape = new flashimpl.Shape(Display.root, Display.root, params);
                if (params) {
                    if (params.alpha) {
                        shape.alpha = params.alpha;
                    }
                    if (params.x) {
                        shape.x = params.x;
                    }
                    if (params.y) {
                        shape.y = params.y;
                    }
                }
                function getMotionMaximumLifeTime(motion) {
                    var motionAnimation;
                    var propertyNames = ['x', 'y', 'alpha', 'rotationZ', 'rotationY'];
                    var maxLife = 0;
                    var literalMaxLife = 0;
                    for (var j = 0; j < 5; j++) {
                        motionAnimation = motion[propertyNames[j]];
                        if (motionAnimation) {
                            if (!motionAnimation.lifeTime) {
                                motionAnimation.lifeTime = AdvancedDanamaku.startParams.bp.options.commentLifeTime / 1000;
                            }
                            if (motionAnimation.startDelay) {
                                maxLife = Math.max(maxLife, motionAnimation.lifeTime * 1000 + motionAnimation.startDelay);
                            }
                            else {
                                maxLife = Math.max(maxLife, motionAnimation.lifeTime * 1000);
                            }
                            literalMaxLife = Math.max(literalMaxLife, motionAnimation.lifeTime * 1000);
                        }
                    }
                    return {
                        maxLife: maxLife,
                        literalMaxLife: literalMaxLife
                    };
                }
                var motion;
                var life;
                var now = getTimer();
                if (params) {
                    if (params.motion) {
                        motion = params.motion;
                        motion.sourceObject = shape;
                        motion.createdTime = now;
                        life = getMotionMaximumLifeTime(motion);
                        motion.maximumLifeTime = life.maxLife;
                        // 不需要更新 now
                        AdvancedDanamaku.registerMotion(motion);
                    }
                    if (params.motionGroup) {
                        for (var i = 0; i < params.motionGroup.length; i++) {
                            motion = params.motionGroup[i];
                            motion.sourceObject = shape;
                            motion.createdTime = now;
                            life = getMotionMaximumLifeTime(motion);
                            motion.maximumLifeTime = life.maxLife;
                            AdvancedDanamaku.registerMotion(motion);
                            now += life.literalMaxLife;
                        }
                    }
                    if (params.motion && params.motionGroup) {
                        console.warn("'motion' and 'motionGroup' are both set!");
                    }
                }
                return shape;
            };
            Display.createCanvas = function (params) {
                return new flashimpl.Canvas(Display.root, Display.root, params);
            };
            Display.createButton = function (text, params) {
                throw new NotImplementedError();
            };
            Display.createGlowFilter = function (color, alpha, blurX, blurY, strength, quality, inner, knockout) {
                if (color === void 0) { color = 0xff0000; }
                if (alpha === void 0) { alpha = 1.0; }
                if (blurX === void 0) { blurX = 6.0; }
                if (blurY === void 0) { blurY = 6.0; }
                if (strength === void 0) { strength = 2; }
                if (quality === void 0) { quality = flash.filters.BitmapFilterQuality.LOW; }
                if (inner === void 0) { inner = false; }
                if (knockout === void 0) { knockout = false; }
                return new flash.filters.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
            };
            Display.createBlurFilter = function (blurX, blurY, quality) {
                if (blurX === void 0) { blurX = 4.0; }
                if (blurY === void 0) { blurY = 4.0; }
                if (quality === void 0) { quality = 1; }
                return new flash.filters.BlurFilter(blurX, blurY, quality);
            };
            Display.toIntVector = function (array) {
                // jabbany
                Object.defineProperty(array, 'as3Type', {
                    get: function () {
                        return 'Vector.<int>';
                    },
                    set: function (v) {
                        mic.trace('Oh come on...');
                    }
                });
                return array;
            };
            Display.toUIntVector = function (array) {
                // jabbany
                Object.defineProperty(array, 'as3Type', {
                    get: function () {
                        return 'Vector.<int>';
                    },
                    set: function (v) {
                        mic.trace('Oh come on...');
                    }
                });
                return array;
            };
            Display.toNumberVector = function (array) {
                // jabbany
                Object.defineProperty(array, 'as3Type', {
                    get: function () {
                        return 'Vector.<int>';
                    },
                    set: function (v) {
                        mic.trace('Oh come on...');
                    }
                });
                return array;
            };
            Display.createVector3D = function (x, y, z, w) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (z === void 0) { z = 0; }
                if (w === void 0) { w = 0; }
                return new flash.geom.Vector3D(x, y, z, w);
            };
            Display.createMatrix3D = function (a) {
                if (a === void 0) { a = null; }
                return new flash.geom.Matrix3D(a);
            };
            Display.createColorTransform = function () {
                return new flash.geom.ColorTransform();
            };
            Display.createTextFormat = function () {
                return new flash.text.TextFormat();
            };
            Display.createGraphic = function () {
                throw new NotImplementedError();
            };
            // CCL compatible
            // jabbany
            Display.projectVector = function (matrix, vector) {
                return matrix.transformVector(vector);
            };
            // CCL compatible
            // jabbany
            Display.projectVectors = function (matrix, vertices, projectedVertices, uvts) {
                while (projectedVertices.length > 0) {
                    projectedVertices.pop();
                }
                if (vertices.length % 3 != 0) {
                    mic.trace("Display.projectVectors input vertex Vector must be a multiple of 3.", "err");
                    return;
                }
                var transformed = [];
                matrix.transformVectors(vertices, transformed);
                for (var i = 0; i < transformed.length / 3; i++) {
                    var x = transformed[i * 3], y = transformed[i * 3 + 1];
                    projectedVertices.push(x, y);
                }
            };
            Object.defineProperty(Display, "root", {
                get: function () {
                    // TODO: Remove force type cast when flash.d.ts is fully synced with implementations.
                    return AdvancedDanamaku.startParams.stage;
                },
                enumerable: true,
                configurable: true
            });
            return Display;
        })(ProofObject);
        bilidanmaku.Display = Display;
        var Player = (function (_super) {
            __extends(Player, _super);
            function Player() {
                _super.apply(this, arguments);
            }
            Player.play = function () {
                throw new NotImplementedError();
            };
            Player.pause = function () {
                throw new NotImplementedError();
            };
            Player.seek = function (offset) {
                throw new NotImplementedError();
            };
            Player.jump = function (av, page, newWindow) {
                if (page === void 0) { page = 1; }
                if (newWindow === void 0) { newWindow = false; }
                throw new NotImplementedError();
            };
            Object.defineProperty(Player, "state", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player, "time", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Player.commentTrigger = function (f, timeout) {
                if (timeout === void 0) { timeout = 1000; }
                throw new NotImplementedError();
            };
            Player.keyTrigger = function (f, timeout, up) {
                if (timeout === void 0) { timeout = 1000; }
                if (up === void 0) { up = false; }
                throw new NotImplementedError();
            };
            Player.setMask = function (obj) {
                throw new NotImplementedError();
            };
            Player.createSound = function (t, onLoad) {
                if (onLoad === void 0) { onLoad = null; }
                throw new NotImplementedError();
            };
            Object.defineProperty(Player, "commentList", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player, "width", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player, "height", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player, "videoWidth", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Player, "videoHeight", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            return Player;
        })(ProofObject);
        bilidanmaku.Player = Player;
        var PlayerState = (function () {
            function PlayerState() {
            }
            Object.defineProperty(PlayerState, "PLAYING", {
                get: function () {
                    return 'playing';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlayerState, "STOP", {
                get: function () {
                    return 'stop';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(PlayerState, "PAUSE", {
                get: function () {
                    return 'pause';
                },
                enumerable: true,
                configurable: true
            });
            return PlayerState;
        })();
        bilidanmaku.PlayerState = PlayerState;
        var MotionEasing = (function () {
            function MotionEasing() {
            }
            Object.defineProperty(MotionEasing, "NONE", {
                get: function () {
                    return 'None';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "BACK", {
                get: function () {
                    return 'Back';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "BOUNCE", {
                get: function () {
                    return 'Bounce';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "CIRCULAR", {
                get: function () {
                    return 'Circular';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "CUBIC", {
                get: function () {
                    return 'Cubic';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "ELASTIC", {
                get: function () {
                    return 'Elastic';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "EXPONENTIAL", {
                get: function () {
                    return 'Exponential';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "SINE", {
                get: function () {
                    return 'Sine';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "QUINTIC", {
                get: function () {
                    return 'Quintic';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(MotionEasing, "LINEAR", {
                get: function () {
                    return 'Linear';
                },
                enumerable: true,
                configurable: true
            });
            return MotionEasing;
        })();
        bilidanmaku.MotionEasing = MotionEasing;
        var CommentField = (function (_super) {
            __extends(CommentField, _super);
            function CommentField(root, parent, createParams) {
                _super.call(this, root, parent);
                this.alwaysShowSelection = false;
                this.condenseWhite = true;
                this.defaultTextFormat = null;
                this.gridFitType = GridFitType.NONE;
                this.restrict = RestrictEncoding.NULL;
                this.sharpness = 0;
                this.autoSize = true;
                this.wordWrap = false;
                this._background = false;
                this._backgroundColor = 0xffffff;
                this._border = false;
                this._borderColor = 0x000000;
                this._textColor = 0xffffff;
                this._thickness = 0;
                this._bold = false;
                this._italic = false;
                this._fontsize = 12;
                this._needRecalcNumLines = true;
                this._createParams = createParams;
                this._lifeTime = AdvancedDanamaku.startParams.bp.options.commentLifeTime;
                this.updateCanvasSettings();
            }
            Object.defineProperty(CommentField.prototype, "background", {
                get: function () {
                    return this._background;
                },
                set: function (v) {
                    var b = this._background != v;
                    this._background = v;
                    b && this._bp_invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "backgroundColor", {
                get: function () {
                    return this._backgroundColor;
                },
                set: function (v) {
                    v |= 0;
                    var b = this._backgroundColor != v;
                    this._backgroundColor = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "border", {
                get: function () {
                    return this._border;
                },
                set: function (v) {
                    var b = this._border != v;
                    this._border = v;
                    b && this._bp_invalidate();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "borderColor", {
                get: function () {
                    return this._borderColor;
                },
                set: function (v) {
                    v |= 0;
                    var b = this._borderColor != v;
                    this._borderColor = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "bottomScrollV", {
                get: function () {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            CommentField.prototype._bp_draw_core = function () {
                _super.prototype._bp_draw_core.call(this);
                // clear the canvas
                var context = this._bp_context();
                var width = this._bp_displayBuffer.width;
                var height = this._bp_displayBuffer.height;
                context.clearRect(0, 0, width, height);
                if (this.background) {
                    context.fillStyle = this._backgroundFillStyle;
                    context.fillRect(0, 0, width, height);
                    context.fillStyle = this._textFillStyle;
                }
                if (this.autoSize) {
                    context.fillText(this.text, 1, this.height - 1);
                    context.strokeText(this.text, 1, this.height - 1);
                }
                else {
                    context.fillText(this.text, 0, this.textHeight);
                    context.strokeText(this.text, 0, this.textHeight);
                }
                if (this.border) {
                    context.strokeStyle = this._borderStrokeStyle;
                    context.lineWidth = 1;
                    context.strokeRect(0, 0, width, height);
                    context.strokeStyle = this._textStrokeStyle;
                    context.lineWidth = this.thickness;
                }
            };
            Object.defineProperty(CommentField.prototype, "htmlText", {
                get: function () {
                    throw new NotImplementedError();
                },
                set: function (v) {
                    throw new NotImplementedError();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "length", {
                get: function () {
                    return this.text.length;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "multiline", {
                get: function () {
                    return this.numLines > 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "numLines", {
                get: function () {
                    if (this._needRecalcNumLines) {
                        if (this.text == null) {
                            this._numLines = 0;
                        }
                        else {
                            var t = this.text.split(/\r\n|\r|\n/g);
                            this._numLines = t.length;
                        }
                        this._needRecalcNumLines = false;
                    }
                    return this._numLines;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "text", {
                get: function () {
                    return this._text;
                },
                set: function (v) {
                    var b = this._text != v;
                    this._text = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "textColor", {
                get: function () {
                    return this._textColor;
                },
                set: function (v) {
                    v |= 0;
                    var b = this._textColor != v;
                    this._textColor = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "textHeight", {
                get: function () {
                    return this.fontsize;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "textWidth", {
                get: function () {
                    return this._textWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "thickness", {
                get: function () {
                    return this._thickness;
                },
                set: function (v) {
                    if (v < 0) {
                        v = 0;
                    }
                    var b = this._thickness != v;
                    this._thickness = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "fontsize", {
                get: function () {
                    return this._fontsize;
                },
                set: function (v) {
                    if (v < 1) {
                        v = 1;
                    }
                    var b = this._fontsize != v;
                    this._fontsize = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "bold", {
                get: function () {
                    return this._bold;
                },
                set: function (v) {
                    var b = this._bold != v;
                    this._bold = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "italic", {
                get: function () {
                    return this._italic;
                },
                set: function (v) {
                    var b = this._italic != v;
                    this._italic = v;
                    b && this.updateCanvasSettings();
                },
                enumerable: true,
                configurable: true
            });
            CommentField.prototype.appendText = function (newText) {
                this.text += newText;
            };
            Object.defineProperty(CommentField.prototype, "createParams", {
                get: function () {
                    return this._createParams;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "x", {
                get: function () {
                    return this._x;
                },
                set: function (v) {
                    this._bp_displayBuffer.style.left = this._x.toString() + 'px';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "y", {
                get: function () {
                    return this._y;
                },
                set: function (v) {
                    this._bp_displayBuffer.style.top = this._y.toString() + 'px';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(CommentField.prototype, "lifeTime", {
                // Bulletproof
                get: function () {
                    return this._lifeTime;
                },
                enumerable: true,
                configurable: true
            });
            // WARNING: WILL CLEAR ALL STYLE SETTINGS AND DRAWINGS OF THE CANVAS
            CommentField.prototype.updateSizeIfAutoSized = function () {
                if (this.autoSize) {
                    var context = this._bp_context();
                    var metrics = context.measureText(this.text);
                    this._textWidth = metrics.width;
                    this.width = this.textWidth + 2;
                    this.height = this.textHeight + 2;
                    this._bp_invalidate();
                }
            };
            CommentField.prototype.updateCanvasSettings = function () {
                this._fontString = this.getRenderFontStyleString();
                var context = this._bp_context();
                context.font = this._fontString;
                this.updateStyles();
                this.updateSizeIfAutoSized();
                if (this.autoSize) {
                    // 因为上一步清除了样式，包括字体
                    context.font = this._fontString;
                    this.updateStyles();
                }
                this._bp_invalidate();
            };
            CommentField.prototype.getRenderFontStyleString = function () {
                var fontString = '';
                this.bold && (fontString += ' bold');
                this.italic && (fontString += ' italic');
                fontString += ' ' + this.fontsize.toString() + 'pt ';
                fontString += CommentField._defaultTextFontFamily;
                return fontString;
            };
            CommentField.prototype.updateStyles = function () {
                var context = this._bp_context();
                context.lineWidth = this.thickness;
                this._textFillStyle = mic.Color.rgbNumberToCssSharp(this.textColor);
                this._textStrokeStyle = this._textFillStyle;
                context.fillStyle = this._textFillStyle;
                context.strokeStyle = this._textStrokeStyle;
                context.lineWidth = this.thickness;
                this._backgroundFillStyle = mic.Color.rgbNumberToCss(this.backgroundColor);
                this._borderStrokeStyle = mic.Color.rgbNumberToCssSharp(this.borderColor);
            };
            CommentField._defaultTextHeight = 12;
            CommentField._defaultTextFontFamily = 'SimHei';
            CommentField._defaultBorderWidth = 1;
            return CommentField;
        })(flash.display.DisplayObject);
        bilidanmaku.CommentField = CommentField;
        var CommentBitmap = (function (_super) {
            __extends(CommentBitmap, _super);
            function CommentBitmap() {
                _super.apply(this, arguments);
            }
            return CommentBitmap;
        })(flash.display.Bitmap);
        bilidanmaku.CommentBitmap = CommentBitmap;
        var Global = (function () {
            function Global() {
            }
            Global._set = function (key, val) {
                Global._map.set(key, val);
            };
            Global._get = function (key) {
                return Global._map.get(key);
            };
            Global._map = new Map();
            return Global;
        })();
        bilidanmaku.Global = Global;
        var ScriptManager = (function () {
            function ScriptManager() {
            }
            ScriptManager.clearTimer = function () {
                throw new NotImplementedError();
            };
            ScriptManager.clearEl = function () {
                throw new NotImplementedError();
            };
            ScriptManager.clearTrigger = function () {
                throw new NotImplementedError();
            };
            return ScriptManager;
        })();
        bilidanmaku.ScriptManager = ScriptManager;
        var Tween = (function (_super) {
            __extends(Tween, _super);
            function Tween(obj, prop, func, begin, finish, duration, useSeconds) {
                if (useSeconds === void 0) { useSeconds = false; }
                _super.call(this, obj, prop, func, begin, finish, duration, useSeconds);
            }
            Tween.prototype.play = function () {
                throw new NotImplementedError();
            };
            Tween.prototype.gotoAndPlay = function (time) {
                throw new NotImplementedError();
            };
            Tween.prototype.gotoAndStop = function (time) {
                throw new NotImplementedError();
            };
            Tween.prototype.togglePause = function () {
                throw new NotImplementedError();
            };
            Tween.tween = function (object, dest, src, duration, easing) {
                throw new NotImplementedError();
            };
            Tween.to = function (object, dest, duration, easing) {
                throw new NotImplementedError();
            };
            Tween.bezier = function (object, dest, src, control) {
                throw new NotImplementedError();
            };
            Tween.scale = function (src, scale) {
                throw new NotImplementedError();
            };
            Tween.delay = function (src, delay) {
                throw new NotImplementedError();
            };
            Tween.reverse = function (src) {
                throw new NotImplementedError();
            };
            Tween.repeat = function (src, times) {
                throw new NotImplementedError();
            };
            Tween.slice = function (src, from, to) {
                throw new NotImplementedError();
            };
            Tween.serial = function (src1) {
                var other = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    other[_i - 1] = arguments[_i];
                }
                throw new NotImplementedError();
            };
            Tween.parallel = function (src1) {
                var other = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    other[_i - 1] = arguments[_i];
                }
                throw new NotImplementedError();
            };
            return Tween;
        })(fl.transitions.Tween);
        bilidanmaku.Tween = Tween;
        var Bitmap = (function () {
            function Bitmap() {
            }
            Bitmap.createBitmapData = function (width, height, transparent, fillColor) {
                if (transparent === void 0) { transparent = true; }
                if (fillColor === void 0) { fillColor = 0xffffffff; }
                throw new NotImplementedError();
            };
            Bitmap.createRectangle = function (x, y, width, height) {
                if (x === void 0) { x = 0; }
                if (y === void 0) { y = 0; }
                if (width === void 0) { width = 0; }
                if (height === void 0) { height = 0; }
                return new flash.geom.Rectangle(x, y, width, height);
            };
            Bitmap.createBitmap = function (params) {
                throw new NotImplementedError();
            };
            Bitmap.__canUse = false;
            return Bitmap;
        })();
        bilidanmaku.Bitmap = Bitmap;
        var Storage = (function () {
            function Storage() {
            }
            Storage.loadRank = function (complete, err) {
                if (err === void 0) { err = null; }
                throw new NotImplementedError();
            };
            Storage.uploadScore = function (score, name, complete, err) {
                if (name === void 0) { name = null; }
                if (complete === void 0) { complete = null; }
                if (err === void 0) { err = null; }
                throw new NotImplementedError();
            };
            Storage.saveData = function (userData, complete, err) {
                if (complete === void 0) { complete = null; }
                if (err === void 0) { err = null; }
                throw new NotImplementedError();
            };
            Storage.loadData = function (complete, err) {
                if (complete === void 0) { complete = null; }
                if (err === void 0) { err = null; }
                throw new NotImplementedError();
            };
            Storage.__canUse = false;
            return Storage;
        })();
        bilidanmaku.Storage = Storage;
        var Utils = (function () {
            function Utils() {
            }
            Utils.hue = function (v) {
                v = v % 360;
                // http://blog.sina.com.cn/s/blog_5de73d0b0101baxq.html
                var lambda = v / 60 * 255;
                var r = mic.util.limit(510 - lambda, 0, 255);
                var g = mic.util.limit(v < 180 ? lambda : lambda - 510, 0, 255);
                var b = mic.util.limit(v < 180 ? lambda - 510 : lambda, 0, 255);
                return (0xff << 24) | (r << 16) | (g << 8) | b;
            };
            Utils.rgb = function (r, g, b) {
                r = mic.util.limit(r, 0, 255);
                g = mic.util.limit(g, 0, 255);
                b = mic.util.limit(b, 0, 255);
                return (0xff << 24) | (r << 16) | (g << 8) | b;
            };
            Utils.formatTimes = function (time) {
                throw new NotImplementedError();
            };
            Utils.delay = function (closure, delay) {
                if (typeof closure == 'string') {
                    closure += '();';
                }
                return setTimeout(closure, delay);
            };
            Utils.interval = function (closure, delay, times) {
                return new flashimpl.Timer(closure, delay, times);
            };
            Utils.distance = function (x1, y1, x2, y2) {
                return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
            };
            Utils.rand = function (min, max) {
                console.assert(min < max, 'max must be bigger than min.');
                return Math.random() * (max - min) + min;
            };
            return Utils;
        })();
        bilidanmaku.Utils = Utils;
        function trace(message) {
            console.debug(message);
        }
        bilidanmaku.trace = trace;
        function clear() {
            console.clear();
        }
        bilidanmaku.clear = clear;
        function getTimer() {
            return Date.now() - AdvancedDanamaku.startParams.startDate.getTime();
        }
        bilidanmaku.getTimer = getTimer;
        function timer(closure, delay) {
            return Utils.delay(closure, delay);
        }
        bilidanmaku.timer = timer;
        function interval(closure, delay, times) {
            if (times === void 0) { times = 1; }
            return Utils.interval(closure, delay, times);
        }
        bilidanmaku.interval = interval;
        function foreach(loop, f) {
            for (var key in loop) {
                if (loop.hasOwnProperty(key)) {
                    f(key, loop[key]);
                }
            }
        }
        bilidanmaku.foreach = foreach;
        function clone(object) {
            function cloneInternal(object) {
                var type = typeof object;
                switch (type) {
                    case 'number':
                        return object;
                    case 'string':
                        return object;
                    case 'function':
                        return object;
                    case 'object':
                        if (object == null) {
                            return null;
                        }
                        if (object instanceof Array) {
                            var a = [];
                            for (var i = 0; i < object.length; i++) {
                                a.push(cloneInternal(object[i]));
                            }
                            return a;
                        }
                        else {
                            var o = {};
                            for (var key in object) {
                                if (object.hasOwnProperty(key)) {
                                    o[key] = clone(object[key]);
                                }
                            }
                            return o;
                        }
                    case 'undefined':
                        return undefined;
                    default:
                        return object;
                }
            }
            return cloneInternal(object);
        }
        bilidanmaku.clone = clone;
        function load(libraryName, onComplete) {
            var availableLibraries = [
                'libBitmap',
                'libStorage'
            ];
            var index = availableLibraries.indexOf(libraryName);
            if (index >= 0) {
                switch (index) {
                    case 0:
                        Bitmap.__canUse = true;
                        break;
                    case 1:
                        Storage.__canUse = true;
                        break;
                    default:
                        break;
                }
            }
        }
        bilidanmaku.load = load;
        bilidanmaku.$ = Display;
        bilidanmaku.$G = Global;
        var GridFitType = (function () {
            function GridFitType() {
            }
            Object.defineProperty(GridFitType, "NONE", {
                get: function () {
                    return 'none';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridFitType, "PIXEL", {
                get: function () {
                    return 'pixel';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(GridFitType, "SUBPIXEL", {
                get: function () {
                    return 'subpixel';
                },
                enumerable: true,
                configurable: true
            });
            return GridFitType;
        })();
        bilidanmaku.GridFitType = GridFitType;
        var RestrictEncoding = (function () {
            function RestrictEncoding() {
            }
            Object.defineProperty(RestrictEncoding, "NULL", {
                get: function () {
                    return null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestrictEncoding, "UTF8", {
                get: function () {
                    return 'utf8';
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(RestrictEncoding, "GBK", {
                get: function () {
                    return 'gbk';
                },
                enumerable: true,
                configurable: true
            });
            return RestrictEncoding;
        })();
        bilidanmaku.RestrictEncoding = RestrictEncoding;
        var flashimpl;
        (function (flashimpl) {
            var Timer = (function (_super) {
                __extends(Timer, _super);
                function Timer(closure, delay, repeatCount) {
                    if (repeatCount === void 0) { repeatCount = 1; }
                    _super.call(this, delay, repeatCount);
                    this._closure = closure;
                    if (typeof this._closure == 'string') {
                        this._possibleClosure = this._closure + '();';
                    }
                }
                Timer.prototype._bp_timerCallbackInternal = function () {
                    if (this._closure != null) {
                        var type = typeof this._closure;
                        switch (type) {
                            case 'string':
                                eval(this._possibleClosure);
                                break;
                            case 'function':
                                this._closure.call(window);
                                break;
                            default:
                                break;
                        }
                    }
                };
                return Timer;
            })(flash.utils.Timer);
            flashimpl.Timer = Timer;
            var Shape = (function (_super) {
                __extends(Shape, _super);
                function Shape(root, parent, createParams) {
                    _super.call(this, root, parent);
                    this._lifeTime = AdvancedDanamaku.startParams.bp.options.commentLifeTime;
                    this._createParams = createParams;
                }
                Object.defineProperty(Shape.prototype, "createParams", {
                    get: function () {
                        return this._createParams;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Shape.prototype, "lifeTime", {
                    get: function () {
                        return this._lifeTime;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Shape;
            })(flash.display.Shape);
            flashimpl.Shape = Shape;
            var Canvas = (function (_super) {
                __extends(Canvas, _super);
                function Canvas(root, parent, createParams) {
                    _super.call(this, root, parent);
                    this._lifeTime = AdvancedDanamaku.startParams.bp.options.commentLifeTime;
                    this._createParams = createParams;
                }
                Object.defineProperty(Canvas.prototype, "createParams", {
                    get: function () {
                        return this._createParams;
                    },
                    enumerable: true,
                    configurable: true
                });
                Canvas.prototype.remove = function () {
                    if (this._parent) {
                        this._parent.removeChild(this);
                    }
                };
                Object.defineProperty(Canvas.prototype, "lifeTime", {
                    get: function () {
                        return this._lifeTime;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Canvas;
            })(mx.containers.Canvas);
            flashimpl.Canvas = Canvas;
        })(flashimpl = bilidanmaku.flashimpl || (bilidanmaku.flashimpl = {}));
    })(bilidanmaku = bulletproof.bilidanmaku || (bulletproof.bilidanmaku = {}));
})(bulletproof = exports.bulletproof || (exports.bulletproof = {}));
//# sourceMappingURL=bulletproof-bilidanmaku.js.map