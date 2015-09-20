/**
 * Created by MIC on 2015/8/27.
 */

/// <reference path="../../../include/ext/pixi.js/pixi.js.d.ts"/>

import bulletproof_org = require("./bulletproof-org");
import bulletproof_mic = require("./bulletproof-mic");
import bulletproof_thirdparty = require("./bulletproof-thirdparty");

export module bulletproof.flash {

    import mic = bulletproof_mic.bulletproof.mic;
    import thirdparty = bulletproof_thirdparty.bulletproof.thirdparty;

    import ICloneable = bulletproof_org.bulletproof.ICloneable;
    import ICopyable = bulletproof_org.bulletproof.ICopyable;
    import NotImplementedError = bulletproof_org.bulletproof.NotImplementedError;
    import ArgumentError = bulletproof_org.bulletproof.ArgumentError;

    export module events {

        import EventClass = bulletproof_org.bulletproof.EventClass;

        interface IEventDispatcher extends EventTarget {

            hasEventListener(type:string):boolean;
            willTrigger(type:string):boolean;

        }

        export class EventDispatcher implements IEventDispatcher {

            private _listeners:Map<string, Array<EventListener>>;

            public constructor() {
                this._listeners = new Map<string, Array<EventListener>>();
            }

            public addEventListener(type:string, listener:EventListener, useCapture?:boolean):void {
                // jabbany
                if (!this._listeners.has(type)) {
                    this._listeners.set(type, []);
                }
                this._listeners.get(type).push(listener);
            }

            public dispatchEvent(event:Event, data?:any):boolean {
                // jabbany
                if (this._listeners.has(event.type) && this._listeners.get(event.type) != null) {
                    var arr = this._listeners.get(event.type);
                    for (var i = 0; i < arr.length; i++) {
                        try {
                            arr[i](data);
                        } catch (ex) {
                            if (ex.hasOwnProperty('stack')) {
                                mic.trace(ex.stack.toString(), 'dispatchEvent: error');
                            } else {
                                mic.trace(ex.toString(), 'dispatchEvent: error');
                            }
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }

            public hasEventListener(type:string):boolean {
                return this._listeners.has(type);
            }

            public removeEventListener(type:string, listener:EventListener, useCapture?:boolean):void {
                // jabbany
                if (!this._listeners.has(type) || this._listeners.get(type).length == 0) {
                    return;
                }
                var index = this._listeners.get(type).indexOf(listener);
                if (index >= 0) {
                    this._listeners.get(type).splice(index, 1);
                }
            }

            public willTrigger(type:string):boolean {
                return this._listeners.has(type) && this._listeners.get(type).length > 0;
            }

        }

        export class UncaughtErrorEvents extends EventDispatcher {

            public constructor() {
                super();
            }

        }

        export class FlashEvent extends EventClass {

            public static get ACTIVATE():string {
                return 'activate';
            }

            public static get ADDED():string {
                return 'added';
            }

            public static get ADDED_TO_STAGE():string {
                return 'addedToStage';
            }

            public static get BROWSER_ZOOM_CHANGE():string {
                return 'browserZoomChange';
            }

            public static get CANCEL():string {
                return 'cancel';
            }

            public static get CHANGE():string {
                return 'change';
            }

            public static get CLEAR():string {
                return 'clear';
            }

            public static get CLOSE():string {
                return 'close';
            }

            public static get CLOSING():string {
                return 'closing';
            }

            public static get COMPLETE():string {
                return 'complete';
            }

            public static get CONNECT():string {
                return 'connect';
            }

            public static get COPY():string {
                return 'copy';
            }

            public static get CUT():string {
                return 'cut';
            }

            public static get DEACTIVATE():string {
                return 'deactivate';
            }

            public static get DISPLAYING():string {
                return 'displaying';
            }

            public static get ENTER_FRAME():string {
                return 'enterFrame';
            }

            public static get EXIT_FRAME():string {
                return 'exitFrame';
            }

            public static get EXITING():string {
                return 'exiting';
            }

            public static get FRAME_CONSTRUCTED():string {
                return 'frameConstructed';
            }

            public static get FULLSCREEN():string {
                return 'fullScreen';
            }

            public static get HTML_BOUNDS_CHANGE():string {
                return 'htmlBoundsChange';
            }

            public static get HTML_DOM_INITIALIZE():string {
                return 'htmlDOMInitialize';
            }

            public static get HTML_RENDER():string {
                return 'htmlRender';
            }

            public static get ID3():string {
                return 'id3';
            }

            public static get INIT():string {
                return 'init';
            }

            public static get LOCATION_CHANGE():string {
                return 'locationChange';
            }

            public static get MOUSE_LEAVE():string {
                return 'mouseLeave';
            }

            public static get NETWORK_CHANGE():string {
                return 'networkChange';
            }

            public static get OPEN():string {
                return 'open';
            }

            public static get PASTE():string {
                return 'paste';
            }

            public static get REMOVED():string {
                return 'removed';
            }

            public static get REMOVED_FROM_STAGE():string {
                return 'removedFromStage';
            }

            public static get RENDER():string {
                return 'render';
            }

            public static get RESIZE():string {
                return 'resize';
            }

            public static get SCROLL():string {
                return 'scroll';
            }

            public static get SELECT():string {
                return 'select';
            }

            public static get SELECT_ALL():string {
                return 'selectAll';
            }

            public static get SOUND_COMPLETE():string {
                return 'soundComplete';
            }

            public static get STANDARD_ERROR_CLOSE():string {
                return 'standardErrorClose';
            }

            public static get STANDARD_INPUT_CLOSE():string {
                return 'standardInputClose';
            }

            public static get STANDARD_OUTPUT_CLOSE():string {
                return 'standardOutputClose';
            }

            public static get TAB_CHILDREN_CHANGE():string {
                return 'tabChildrenChange';
            }

            public static get TAB_ENABLED_CHANGE():string {
                return 'tabEnabledChange';
            }

            public static get TAB_INDEX_CHANGE():string {
                return 'tabIndexChange';
            }

            public static get TEXT_INTERACTION_MODE_CHANGE():string {
                return 'textInteractionModeChange';
            }

            public static get UNLOAD():string {
                return 'unload';
            }

            public static get USER_IDLE():string {
                return 'userIdle';
            }

            public static get USER_PRESENT():string {
                return 'userPresent';
            }

        }

        export class TimerEvent extends FlashEvent implements ICloneable<TimerEvent> {

            public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
                super(type, bubbles, cancelable);
            }

            public static get TIMER():string {
                return 'timer';
            }

            public static get TIMER_COMPLETE():string {
                return 'timerComplete';
            }

            public updateAfterEvent():void {
                throw new NotImplementedError();
            }

            public clone():TimerEvent {
                throw new NotImplementedError();
            }

        }

        export class UncaughtErrorEvent extends FlashEvent implements ICloneable<UncaughtErrorEvent> {

            public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false) {
                super(type, bubbles, cancelable);
            }

            public static get UNCAUGHT_ERROR():string {
                return 'uncaughtError';
            }

            public clone():UncaughtErrorEvent {
                throw new NotImplementedError();
            }

        }

        export class ActivityEvent extends FlashEvent implements ICloneable<ActivityEvent> {

            private _activating:boolean;

            public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, activating:boolean = false) {
                super(type, bubbles, cancelable);
                this._activating = activating;
            }

            public clone():ActivityEvent {
                throw new NotImplementedError();
            }

            public static get ACTIVITY():string {
                return 'activity';
            }

        }

        export class FullScreenEvent extends ActivityEvent implements ICloneable<FullScreenEvent> {

            private _fullScreen:boolean;
            private _interactive:boolean;

            public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, fullScreen:boolean = false, interactive:boolean = false) {
                super(type, bubbles, cancelable, true);
                this._fullScreen = fullScreen;
                this._interactive = interactive;
                throw new NotImplementedError();
            }

            public clone():FullScreenEvent {
                throw new NotImplementedError();
            }

            public static get FULL_SCREEN():string {
                return 'fullScreen';
            }

            public static get FULL_SCREEN_INTERACTIVE_ACCEPTED():string {
                return 'fullScreenInteractiveAccepted';
            }

        }

        export class StageVideoEvent extends FlashEvent implements ICloneable<StageVideoEvent> {

            private _colorSpace:string;
            private _status:string;

            public constructor(type:string, bubbles:boolean = false, cancelable:boolean = false, status:string = null, colorSpace:string = null) {
                super(type, bubbles, cancelable);
                this._colorSpace = colorSpace;
                this._status = status;
            }

            public get colorSpace():string {
                return this._colorSpace;
            }

            public get status():string {
                return this._status;
            }

            public static get codecInfo():string {
                // Is doc wrong here?
                throw new NotImplementedError();
            }

            public clone():StageVideoEvent {
                throw new NotImplementedError();
            }

        }

    }

    export module geom {

        import display = bulletproof.flash.display;

        export class Point implements ICloneable<Point>, ICopyable<Point> {

            public x:number;
            public y:number;

            public get length():number {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            }

            public constructor(x:number = 0, y:number = 0) {
                this.x = x;
                this.y = y;
            }

            public add(v:Point):Point {
                return new Point(this.x + v.x, this.y + v.y);
            }

            public clone():Point {
                return new Point(this.x, this.y);
            }

            public copyFrom(sourcePoint:Point):void {
                this.x = sourcePoint.x;
                this.y = sourcePoint.y;
            }

            public static distance(pt1:Point, pt2:Point):number {
                return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y));
            }

            public equals(toCompare:Point):boolean {
                return this.x == toCompare.x && this.y == toCompare.y;
            }

            public static interpolate(pt1:Point, pt2:Point, f:number):Point {
                f = mic.util.limit(f, 0, 1);
                return new Point(pt1.x * f + pt2.x * (1 - f), pt1.y * f + pt2.y * (1 - f));
            }

            public normalize(thickness:number):void {
                var len = this.length;
                if (len > 0) {
                    this.x *= thickness / len;
                    this.y *= thickness / len;
                }
            }

            public offset(dx:number, dy:number):void {
                this.x += dx;
                this.y += dy;
            }

            public static polar(len:number, angle:number):Point {
                return new Point(len * Math.cos(angle), len * Math.sin(angle));
            }

            public setTo(xa:number, ya:number):void {
                this.x = xa;
                this.y = ya;
            }

            public subtract(v:Point):Point {
                return new Point(this.x - v.x, this.y - v.y);
            }

            public toString():string {
                return mic.util.format('(x={0}, y={1})', this.x, this.y);
            }

        }

        export class Rectangle implements ICloneable<Rectangle>, ICopyable<Rectangle> {

            private _x:number;
            private _y:number;
            private _w:number;
            private _h:number;

            public constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
                this._x = x >= 0 ? x : 0;
                this._y = y >= 0 ? y : 0;
                this._w = width >= 0 ? width : 0;
                this._h = height >= 0 ? height : 0;
            }

            public get bottom():number {
                return this._y + this._h;
            }

            public set bottom(v:number) {
                if (v < this._y) {
                    v = this._y;
                }
                this._h = v - this._y;
            }

            public get bottomRight():Point {
                return new Point(this._x + this._w, this._y + this._h);
            }

            public set bottomRight(v:Point) {
                this.right = v.x;
                this.bottom = v.y;
            }

            public get height():number {
                return this._h;
            }

            public set height(v:number) {
                this._h = v >= 0 ? v : 0;
            }

            public get left():number {
                return this._x;
            }

            public set left(v:number) {
                if (v > this._x + this._w) {
                    v = this._x + this._w;
                }
                this._w = this._x + this._w - v;
                this._x = v;
            }

            public get right():number {
                return this._x + this._w;
            }

            public set right(v:number) {
                if (v < this._x) {
                    v = this._x;
                }
                this._w = v - this._x;
            }

            public get size():Point {
                return new Point(this._w, this._h);
            }

            public set size(v:Point) {
                this._w = v.x;
                this._h = v.y;
            }

            public get top():number {
                return this._y;
            }

            public set top(v:number) {
                if (v > this._y + this._h) {
                    v = this._y + this._h;
                }
                this._h = this._y + this._h - v;
                this._y = v;
            }

            public get topLeft():Point {
                return new Point(this._x, this._y);
            }

            public set topLeft(v:Point) {
                this.left = v.x;
                this.top = v.y;
            }

            public get width():number {
                return this._w;
            }

            public set width(v:number) {
                this._w = v;
            }

            public get x():number {
                return this._x;
            }

            public set x(v:number) {
                this._x = v;
            }

            public get y():number {
                return this._y;
            }

            public set y(v:number) {
                this._y = v;
            }

            public clone():Rectangle {
                return new Rectangle(this._x, this._y, this._w, this._h);
            }

            public contains(x:number, y:number):boolean {
                return this.left <= x && x <= this.right && this.top <= y && y <= this.bottom;
            }

            public containsPoint(point:Point):boolean {
                return this.contains(point.x, point.y);
            }

            public containsRect(rect:Rectangle):boolean {
                return this.containsPoint(rect.topLeft) && this.containsPoint(rect.bottomRight);
            }

            public copyFrom(sourceRect:Rectangle):void {
                this._x = sourceRect._x;
                this._y = sourceRect._y;
                this._w = sourceRect._w;
                this._h = sourceRect._h;
            }

            public equals(toCompare:Rectangle):boolean {
                return this._x == toCompare._x && this._y == toCompare._y && this._w == toCompare._w && this._h == toCompare._h;
            }

            public inflate(dx:number, dy:number):void {
                // TODO: bug when dx or dy is less than 0
                this.x -= dx;
                this.width += dx + dx;
                this.y -= dy;
                this.height += dy + dy;
            }

            public inflatePoint(point:Point):void {
                this.inflate(point.x, point.y);
            }

            public intersection(toIntersect:Rectangle):Rectangle {
                var x:number, y:number, w:number, h:number;
                var rect1:Rectangle, rect2:Rectangle;
                if (this.left < toIntersect.left) {
                    rect1 = this;
                    rect2 = toIntersect;
                } else {
                    rect1 = toIntersect;
                    rect2 = this;
                }
                if (rect1.right < rect2.left) {
                    return new Rectangle(); // 不相交
                } else {
                    x = rect2.left;
                    w = Math.min(rect1.right, rect2.right) - x;
                }
                if (this.top < toIntersect.top) {
                    rect1 = this;
                    rect2 = toIntersect;
                } else {
                    rect1 = toIntersect;
                    rect2 = this;
                }
                if (rect1.bottom < rect2.top) {
                    return new Rectangle(); // 不相交
                } else {
                    y = rect2.top;
                    h = Math.min(rect1.bottom, rect2.bottom) - y;
                }
                return new Rectangle(x, y, w, h);
            }

            public intersects(toIntersect:Rectangle):boolean {
                var rect1:Rectangle, rect2:Rectangle;
                if (this.left < toIntersect.left) {
                    rect1 = this;
                    rect2 = toIntersect;
                } else {
                    rect1 = toIntersect;
                    rect2 = this;
                }
                if (rect1.right < rect2.left) {
                    return false;
                }
                if (this.top < toIntersect.top) {
                    rect1 = this;
                    rect2 = toIntersect;
                } else {
                    rect1 = toIntersect;
                    rect2 = this;
                }
                if (rect1.bottom < rect2.top) {
                    return false;
                }
                return true;
            }

            public isEmpty():boolean {
                return this._w <= 0 || this._h <= 0;
            }

            public offset(dx:number, dy:number):void {
                this.x += dx;
                this.y += dy;
            }

            public offsetPoint(point:Point):void {
                this.offset(point.x, point.y);
            }

            public setEmpty():void {
                this._x = this._y = this._w = this._h = 0;
            }

            public setTo(xa:number, ya:number, widtha:number, heighta:number):void {
                this.x = xa;
                this.y = ya;
                this.width = widtha;
                this.height = heighta;
            }

            public toString():string {
                return mic.util.format('{X={0}, Y={1}, Width={2}, Height={3}}', this.x, this.y, this.width, this.height);
            }

            public union(toUnion:Rectangle):Rectangle {
                var x = Math.min(this.x, toUnion.x);
                var y = Math.min(this.y, toUnion.y);
                var r = Math.max(this.right, toUnion.right);
                var b = Math.max(this.bottom, toUnion.bottom);
                return new Rectangle(x, y, r - x, b - y);
            }

        }

        export class Vector3D implements ICloneable<Vector3D>, ICopyable<Vector3D> {

            public static get X_AXIS():Vector3D {
                return new Vector3D(1, 0, 0);
            }

            public static get Y_AXIS():Vector3D {
                return new Vector3D(0, 1, 0);
            }

            public static get Z_AXIS():Vector3D {
                return new Vector3D(0, 0, 1);
            }

            public w:number;
            public x:number;
            public y:number;
            public z:number;

            public get length():number {
                return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
            }

            public get lengthSquared():number {
                return this.x * this.x + this.y * this.y + this.z * this.z;
            }

            public constructor(x:number = 0, y:number = 0, z:number = 0, w:number = 0) {
                this.x = x;
                this.y = y;
                this.z = z;
                this.w = w;
            }

            public add(a:Vector3D):Vector3D {
                return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z, this.w);
            }

            public static angleBetween(a:Vector3D, b:Vector3D):number {
                var vnom = a.x * b.x + a.y * b.y + a.z * b.z;
                var denom = a.length * b.length;
                var val = Math.sqrt(vnom * vnom / denom);
                return Math.acos(val);
            }

            public clone():Vector3D {
                return new Vector3D(this.x, this.y, this.z, this.w);
            }

            public copyFrom(a:Vector3D):void {
                this.x = a.x;
                this.y = a.y;
                this.z = a.z;
                this.w = a.w;
            }

            public crossProduct(a:Vector3D):Vector3D {
                var i = this.y * a.z - this.z * a.y;
                var j = this.z * a.x - this.x * a.z;
                var k = this.x * a.y - this.y * a.x;
                return new Vector3D(i, j, k, this.w);
            }

            public decrementBy(a:Vector3D):void {
                this.x -= a.x;
                this.y -= a.y;
                this.z -= a.z;
            }

            public static distance(pt1:Vector3D, pt2:Vector3D):number {
                return Math.sqrt((pt1.x - pt2.x) * (pt1.x - pt2.x) + (pt1.y - pt2.y) * (pt1.y - pt2.y) + (pt1.z - pt2.z) * (pt1.z - pt2.z));
            }

            public dotProduct(a:Vector3D):number {
                return this.x * a.x + this.y * a.y + this.z * a.z;
            }

            public equals(toCompare:Vector3D, allFour:boolean = false):boolean {
                return this.x == toCompare.x && this.y == toCompare.y && this.z == toCompare.y && !(allFour && this.w != toCompare.w);
            }

            public incrementBy(a:Vector3D):void {
                this.x += a.x;
                this.y += a.y;
                this.z += a.z;
            }

            public nearEquals(toCompare:Vector3D, tolerance:number, allFour:boolean = false):boolean {
                return mic.util.valueBetweenNE(this.x, toCompare.x - tolerance, toCompare.x + tolerance) && mic.util.valueBetweenNE(this.y, toCompare.y - tolerance, toCompare.y + tolerance) &&
                    mic.util.valueBetweenNE(this.z, toCompare.z - tolerance, toCompare.z + tolerance) && !(allFour && !mic.util.valueBetweenNE(this.w, toCompare.w - tolerance, toCompare.w + tolerance));
            }

            public negate():void {
                this.x = -this.x;
                this.y = -this.y;
                this.z = -this.z;
            }

            public normalize():number {
                var len = this.length;
                if (len > 0) {
                    this.x /= len;
                    this.y /= len;
                    this.z /= len;
                }
                return len;
            }

            public project():void {
                if (this.w != null && this.w != 0) {
                    this.x /= this.w;
                    this.y /= this.w;
                    this.z /= this.w;
                }
            }

            public scaleBy(s:number):void {
                this.x *= s;
                this.y *= s;
                this.z *= s;
            }

            public setTo(xa:number, ya:number, za:number):void {
                this.x = xa;
                this.y = ya;
                this.z = za;
            }

            public subtract(a:Vector3D):Vector3D {
                return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z, this.w);
            }

            public toString():string {
                return mic.util.format('[x={0}, y={1}, z={2}]', this.x, this.y, this.z);
            }

        }

        export class Matrix implements ICloneable<Matrix>, ICopyable<Matrix> {

            private _data:Array<number>;

            public get a():number {
                return this._data[0];
            }

            public set a(v:number) {
                this._data[0] = v;
            }

            public get b():number {
                return this._data[3];
            }

            public set b(v:number) {
                this._data[3] = v;
            }

            public get c():number {
                return this._data[1];
            }

            public set c(v:number) {
                this._data[1] = v;
            }

            public get d():number {
                return this._data[4];
            }

            public set d(v:number) {
                this._data[4] = v;
            }

            public get tx():number {
                return this._data[2];
            }

            public set tx(v:number) {
                this._data[2] = v;
            }

            public get ty():number {
                return this._data[5];
            }

            public set ty(v:number) {
                this._data[5] = v;
            }

            public constructor(a:number = 1, b:number = 0, c:number = 1, d:number = 1, tx:number = 0, ty:number = 0) {
                this._data = [a, c, tx, b, d, ty, 0, 0, 1];
            }

            public clone():Matrix {
                return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
            }

            public concat(m:Matrix):void {
                this._data = Matrix.dotProduct(this._data, m._data);
            }

            public copyColumnFrom(column:number, vector3D:Vector3D):void {
                if (column < 0 || column > 2) {
                    throw new RangeError('Column must be 0, 1, or 2.');
                }
                this._data[column * 3] = vector3D.x;
                this._data[1 + column * 3] = vector3D.y;
                this._data[2 + column * 3] = vector3D.z;
            }

            public copyColumnTo(column:number, vector3D:Vector3D):void {
                if (column < 0 || column > 2) {
                    throw new RangeError('Column must be 0, 1, or 2.');
                }
                vector3D.x = this._data[column * 3];
                vector3D.y = this._data[1 + column * 3];
                vector3D.z = this._data[2 + column * 3];
            }

            public copyFrom(sourceMatrix:Matrix):void {
                this._data = sourceMatrix._data.slice();
            }

            public copyRowFrom(row:number, vector3D:Vector3D):void {
                if (row < 0 || row > 2) {
                    throw new RangeError('Row must be 0, 1, or 2.');
                }
                this._data[row] = vector3D.x;
                this._data[row + 3] = vector3D.y;
                this._data[row + 6] = vector3D.z;
            }

            public copyRowTo(row:number, vector3D:Vector3D):void {
                if (row < 0 || row > 2) {
                    throw new RangeError('Column must be 0, 1, or 2.');
                }
                vector3D.x = this._data[row];
                vector3D.y = this._data[3 + row];
                vector3D.z = this._data[6 + row];
            }

            public createBox(scaleX:number, scaleY:number, rotation:number = 0, tx:number = 0, ty:number = 0):void {
                this.identity();
                this.rotate(rotation);
                this.scale(scaleX, scaleY);
                this.translate(tx, ty);
            }

            public createGradientBox(width:number, height:number, rotation:number = 0, tx:number = 0, ty:number = 0):void {
                this.createBox(width, height, rotation, tx, ty);
            }

            public deltaTransformPoint(point:Point):Point {
                throw new NotImplementedError();
            }

            public identity():void {
                this._data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
            }

            public invert():boolean {
                var invResult = mic.util.matrixInvert(this._data);
                if (invResult.canInvert) {
                    this._data = invResult.result;
                }
                return invResult.canInvert;
            }

            public rotate(angle:number):void {
                this._data = Matrix.dotProduct(this._data, [
                    Math.cos(angle), -Math.sin(angle), 0,
                    Math.sin(angle), Math.cos(angle), 0,
                    0, 0, 1
                ]);
            }

            public scale(sx:number, sy:number):void {
                this._data = Matrix.dotProduct(this._data, [
                    sx, 0, 0,
                    0, sy, 0,
                    0, 0, 1
                ]);
            }

            /**
             * Bulletproof
             * @param skewX
             * @param skewY
             */
            public skew(skewX:number, skewY:number):void {
                this._data = Matrix.dotProduct(this._data, [
                    0, Math.tan(skewX), 0,
                    Math.tan(skewY), 0, 0,
                    0, 0, 1
                ]);
            }

            public setTo(aa:number, ba:number, ca:number, da:number, txa:number, tya:number) {
                this._data = [aa, ca, txa, ba, da, tya, 0, 0, 1];
            }

            public toString():string {
                return mic.util.format('[{0} {1} 0\r\n{2} {3} 0\r\n{4} {5} 1]', this.a, this.b, this.c, this.d, this.tx, this.ty);
            }

            public transformPoint(point:Point):Point {
                // 由于 Flash 所用的矩阵是转置过的，所以这里变成了行×行
                //var pointVector = [point.x, point.y, 1];
                //var x = pointVector[0] * this._data[0] + pointVector[1] * this._data[1] + pointVector[2] * this._data[2];
                //var y = pointVector[0] * this._data[3] + pointVector[1] * this._data[4] + pointVector[2] * this._data[5];
                //return new Point(x, y);
                return new Point(point.x * this._data[0] + point.y * this._data[1] + this._data[2],
                    point.x * this._data[3] + point.y * this._data[4] + this._data[5]);
            }

            public translate(dx:number, dy:number):void {
                this.tx += dx;
                this.ty += dy;
            }

            private static dotProduct(a:Array<number>, b:Array<number>):Array<number> {
                if (b.length != 9) {
                    throw new Error('Matrix dot product requires a 3x3 matrix.');
                }
                var result = [0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        for (var k = 0; k < 3; k++) {
                            result[i * 3 + j] += a[i * 3 + k] * b[k * 3 + j];
                        }
                    }
                }
                return result;
            }

        }

        export class Matrix3D implements ICloneable<Matrix3D>, ICopyable<Matrix3D> {

            private _data:Array<number>;

            public get determinant():number {
                var invResult = mic.util.matrixInvert(this.rawData, 4);
                return invResult.determinant;
            }

            public position:Vector3D;

            public get rawData():Array<number> {
                return this._data;
            }

            public set rawData(v:Array<number>) {
                if (v.length < 16) {
                    throw new Error('Data length of Matrix3D must be no less than 16.');
                }
                this._data = v;
            }

            public constructor(v:Array<number> = null) {
                if (v == null || v.length <= 0) {
                    v = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
                }
                this.rawData = v;
            }

            public append(lhs:Matrix3D):void {
                this._data = Matrix3D.dotProduct(lhs._data, this._data);
            }

            public appendRotation(degrees:number, axis:Vector3D, pivotPoint:Vector3D = null):void {
                if (pivotPoint !== null) {
                    this.appendTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                }
                this._data = Matrix3D.dotProduct(Matrix3D.rotationMatrix(degrees * Math.PI / 180, axis), this._data);
                if (pivotPoint !== null) {
                    this.appendTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                }
            }

            public appendScale(xScale:number, yScale:number, zScale:number):void {
                this._data = Matrix3D.dotProduct([
                    xScale, 0, 0, 0,
                    0, yScale, 0, 0,
                    0, 0, zScale, 0,
                    0, 0, 0, 1
                ], this._data);
            }

            public appendTranslation(x:number, y:number, z:number):void {
                this._data = Matrix3D.dotProduct([
                    1, 0, 0, x,
                    0, 1, 0, y,
                    0, 0, 1, z,
                    0, 0, 0, 1
                ], this._data);
            }

            public clone():Matrix3D {
                return new Matrix3D(this.rawData);
            }

            public copyColumnFrom(column:number, vector3D:Vector3D):void {
                if (column < 0 || column > 3) {
                    throw new RangeError('Column must be 0, 1, 2 or 3.');
                }
                this._data[column * 4] = vector3D.x;
                this._data[column * 4 + 1] = vector3D.y;
                this._data[column * 4 + 2] = vector3D.z;
                this._data[column * 4 + 3] = vector3D.w;
            }

            public copyColumnTo(column:number, vector3D:Vector3D):void {
                if (column < 0 || column > 3) {
                    throw new RangeError('Column must be 0, 1, 2 or 3.');
                }
                vector3D.x = this._data[column * 4];
                vector3D.y = this._data[column * 4 + 1];
                vector3D.z = this._data[column * 4 + 2];
                vector3D.w = this._data[column * 4 + 3];
            }

            public copyFrom(sourceMatrix3D:Matrix3D):void {
                this.position = sourceMatrix3D.position.clone();
                this.rawData = sourceMatrix3D.rawData.slice();
            }

            public copyRawDataFrom(vector:Array<number>, index:number = 0, transpose:boolean = false):void {
                throw new NotImplementedError();
            }

            public copyRawDataTo(vector:Array<number>, index:number = 0, transpose:boolean = false):void {
                throw new NotImplementedError();
            }

            public copyRowFrom(row:number, vector3D:Vector3D):void {
                if (row < 0 || row > 3) {
                    throw new RangeError('Row must be 0, 1, 2 or 3.');
                }
                this._data[row] = vector3D.x;
                this._data[row + 4] = vector3D.y;
                this._data[row + 8] = vector3D.z;
                this._data[row + 12] = vector3D.w;
            }

            public copyRowTo(row:number, vector3D:Vector3D):void {
                if (row < 0 || row > 3) {
                    throw new RangeError('Row must be 0, 1, 2 or 3.');
                }
                vector3D.x = this._data[row];
                vector3D.y = this._data[row + 4];
                vector3D.z = this._data[row + 8];
                vector3D.w = this._data[row + 12];
            }

            public copyToMatrix3D(dest:Matrix3D):void {
                dest.position = this.position.clone();
                dest.rawData = this._data.slice();
            }

            public decompose(orientationStyle:string = Orientation3D.EULER_ANGLES):Array<Vector3D> {
                throw new NotImplementedError();
            }

            public deltaTransformVector(v:Vector3D):Vector3D {
                throw new NotImplementedError();
            }

            public identity():void {
                this._data = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
            }

            public static interpolate(thisMat:Matrix3D, toMat:Matrix3D, percent:number):Matrix3D {
                percent = mic.util.limit(percent, 0, 1);
                var data = [];
                for (var i = 0; i < 16; i++) {
                    data.push(thisMat._data[i] * (1 - percent) + toMat._data[i] * percent);
                }
                return new Matrix3D(data);
            }

            public interpolateTo(toMat:Matrix3D, percent:number):Matrix3D {
                return Matrix3D.interpolate(this, toMat, percent);
            }

            public invert():boolean {
                var invResult = mic.util.matrixInvert(this.rawData, 4);
                if (invResult.canInvert) {
                    this._data = invResult.result;
                }
                return invResult.canInvert;
            }

            public pointAt(pos:Vector3D, at:Vector3D = null, up:Vector3D = null):void {
                throw new NotImplementedError();
            }

            public prepend(rhs:Matrix3D):void {
                this._data = Matrix3D.dotProduct(this._data, rhs._data);
            }

            public prependRotation(degrees:number, axis:Vector3D, pivotPoint:Vector3D = null):void {
                if (pivotPoint !== null) {
                    this.prependTranslation(pivotPoint.x, pivotPoint.y, pivotPoint.z);
                }
                this._data = Matrix3D.dotProduct(this._data, Matrix3D.rotationMatrix(degrees * Math.PI / 180, axis));
                if (pivotPoint !== null) {
                    this.prependTranslation(-pivotPoint.x, -pivotPoint.y, -pivotPoint.z);
                }
            }

            public prependScale(xScale:number, yScale:number, zScale:number):void {
                this._data = Matrix3D.dotProduct(this._data, [
                    xScale, 0, 0, 0,
                    0, yScale, 0, 0,
                    0, 0, zScale, 0,
                    0, 0, 0, 1
                ]);
            }

            public prependTranslation(x:number, y:number, z:number):void {
                this._data = Matrix3D.dotProduct(this._data, [
                    1, 0, 0, x,
                    0, 1, 0, y,
                    0, 0, 1, z,
                    0, 0, 0, 1
                ]);
            }

            public recompose(components:Array<Vector3D>, orientationStyle:string = Orientation3D.EULER_ANGLES):boolean {
                throw new NotImplementedError();
            }

            public transformVector(v:Vector3D):Vector3D {
                var x = this._data[0] * v.x + this._data[1] * v.y + this._data[2] * v.z + this._data[3] * v.w;
                var y = this._data[4] * v.x + this._data[5] * v.y + this._data[6] * v.z + this._data[7] * v.w;
                var z = this._data[8] * v.x + this._data[9] * v.y + this._data[10] * v.z + this._data[11] * v.w;
                var w = this._data[12] * v.x + this._data[13] * v.y + this._data[14] * v.z + this._data[15] * v.w;
                return new Vector3D(x, y, z, w);
            }

            public transformVectors(vin:Array<number>, vout:Array<number>):void {
                if (vin.length % 3 !== 0) {
                    throw new Error('transformVectors needs 2 arrays, size of the input array must be multiple of 3.');
                }
                for (var i = 0; i < vin.length / 3; i++) {
                    var x = vin[i * 3], y = vin[i * 3 + 1], z = vin[i * 3 + 2];
                    var rx = this._data[0] * x + this._data[1] * y + this._data[2] * z;
                    var ry = this._data[4] * x + this._data[5] * y + this._data[6] * z;
                    var rz = this._data[8] * x + this._data[9] * y + this._data[10] * z;
                    vout.push(rx, ry, rz);
                }
            }

            public transpose():void {
                this._data = [
                    this._data[0], this._data[4], this._data[8], this._data[12],
                    this._data[1], this._data[5], this._data[9], this._data[13],
                    this._data[2], this._data[6], this._data[10], this._data[14],
                    this._data[3], this._data[7], this._data[11], this._data[15]
                ];
            }

            private static dotProduct(a:Array<number>, b:Array<number>):Array<number> {
                if (a.length !== 16 || b.length !== 16) {
                    throw new Error("Matrix3D dot product needs a array of 16 elements.");
                }
                var res:Array<number> = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                for (var i = 0; i < 4; i++) {
                    for (var j = 0; j < 4; j++) {
                        for (var k = 0; k < 4; k++) {
                            res[i * 4 + j] += a[i * 4 + k] * b[k * 4 + j];
                        }
                    }
                }
                return res;
            }

            private static rotationMatrix(angle:number, axis:Vector3D):Array<number> {
                // jabbany
                var sT:number = Math.sin(angle), cT:number = Math.cos(angle);
                return [
                    cT + axis.x * axis.x * (1 - cT), axis.x * axis.y * (1 - cT) - axis.z * sT, axis.x * axis.z * (1 - cT) + axis.y * sT, 0,
                    axis.x * axis.y * (1 - cT) + axis.z * sT, cT + axis.y * axis.y * (1 - cT), axis.y * axis.z * (1 - cT) - axis.x * sT, 0,
                    axis.z * axis.x * (1 - cT) - axis.y * sT, axis.z * axis.y * (1 - cT) + axis.x * sT, cT + axis.z * axis.z * (1 - cT), 0,
                    0, 0, 0, 1
                ];
            }

        }

        export class ColorTransform {

            public color:number;

            private _alphaMultiplier:number;
            private _alphaOffset:number;
            private _redMultiplier:number;
            private _redOffset:number;
            private _greenMultiplier:number;
            private _greenOffset:number;
            private _blueMultiplier:number;
            private _blueOffset:number;

            public get alphaMultiplier() {
                return this._alphaMultiplier;
            }

            public set alphaMultiplier(v:number) {
                this._alphaMultiplier = v;
            }

            public get alphaOffset() {
                return this._alphaOffset;
            }

            public set alphaOffset(v:number) {
                this._alphaOffset = mic.util.limit(v, -255, 255);
            }

            public get redMultiplier() {
                return this._redMultiplier;
            }

            public set redMultiplier(v:number) {
                this._redMultiplier = v;
            }

            public get redOffset() {
                return this._redOffset;
            }

            public set redOffset(v:number) {
                this._redOffset = mic.util.limit(v, -255, 255);
            }

            public get greenMultiplier() {
                return this._greenMultiplier;
            }

            public set greenMultiplier(v:number) {
                this._greenMultiplier = v;
            }

            public get greenOffset() {
                return this._greenOffset;
            }

            public set greenOffset(v:number) {
                this._greenOffset = mic.util.limit(v, -255, 255);
            }

            public get blueMultiplier() {
                return this._blueMultiplier;
            }

            public set blueMultiplier(v:number) {
                this._blueMultiplier = v;
            }

            public get blueOffset() {
                return this._blueOffset;
            }

            public set blueOffset(v:number) {
                this._blueOffset = mic.util.limit(v, -255, 255);
            }

            public constructor(redMultiplier:number = 1, greenMultiplier:number = 1, blueMultiplier:number = 1, alphaMultiplier:number = 1,
                               redOffset:number = 0, greenOffset:number = 0, blueOffset:number = 0, alphaOffset:number = 0) {
                this.redMultiplier = redMultiplier;
                this.greenMultiplier = greenMultiplier;
                this.blueMultiplier = blueMultiplier;
                this.alphaMultiplier = alphaMultiplier;
                this.redOffset = redOffset;
                this.greenOffset = greenOffset;
                this.blueOffset = blueOffset;
                this.alphaOffset = alphaOffset;
            }

            public concat(second:ColorTransform):void {
                throw new NotImplementedError();
            }

        }

        export class PerspectiveProjection {

            private _fieldOfView:number;

            public get fieldOfView():number {
                return this._fieldOfView;
            }

            public set fieldOfView(v:number) {
                this._fieldOfView = mic.util.limit(v, 0, 180);
            }

            public focalLength:number;
            public projectionCenter:Point;

            public constructor() {
                this.fieldOfView = 90;
                this.focalLength = 10;
                this.projectionCenter = new Point();
            }

            public toMatrix3D():Matrix3D {
                throw new NotImplementedError();
            }

        }

        export class Transform {

            private _pixelBounds:Rectangle;

            public colorTransform:ColorTransform;

            public get concatenatedColorTransform():ColorTransform {
                throw new NotImplementedError();
            }

            public get concatenatedMatrix():Matrix {
                throw new NotImplementedError();
            }

            public matrix:Matrix;
            public matrix3D:Matrix3D;
            public perspectiveProjection:PerspectiveProjection;

            public get pixelBounds():Rectangle {
                return this._pixelBounds;
            }

            public getRelativeMatrix3D(relativeTo:display.DisplayObject):Matrix3D {
                throw new NotImplementedError();
            }

        }

        export class Orientation3D {

            public static get AXIS_ANGLE():string {
                return 'axisAngle';
            }

            public static get EULER_ANGLES():string {
                return 'eulerAngles';
            }

            public static get QUATERNION():string {
                return 'quaternion';
            }

        }

    }

    export module filters {

        export interface IBitmapFilter extends ICloneable<IBitmapFilter> {

            filterType:string

        }

        export class BitmapFilter extends PIXI.AbstractFilter implements IBitmapFilter {

            public get filterType():string {
                return 'filter';
            }

            public clone():BitmapFilter {
                return null;
            }

            public static get FILTER_BLUR():string {
                return 'blur';
            }

            public static get FILTER_GLOW():string {
                return 'glow';
            }

        }

        export class BitmapFilterQuality {

            public static get HIGH():number {
                return 3;
            }

            public static get LOW():number {
                return 1;
            }

            public static get MEDIUM():number {
                return 2;
            }

        }

        export class GlowFilter extends BitmapFilter {

            private _f1:PIXI.filters.ColorMatrixFilter;
            private _f2:PIXI.filters.BlurFilter;
            private _f3:PIXI.filters.ColorMatrixFilter;
            private _color:number;
            private _alpha:number;

            public get alpha():number {
                return this._alpha;
            }

            public set alpha(v:number) {
                this._alpha = v;
                var clr = mic.Color.fromNumber(this.color);
                this._updateColorMatrix(clr.r, clr.g, clr.b, v);
            }

            public get blurX():number {
                return this._f2.blurX;
            }

            public set blurX(v:number) {
                this._f2.blurX = v;
            }

            public get blurY():number {
                return this._f2.blurY;
            }

            public set blurY(v:number) {
                this._f2.blurY = v;
            }

            public get color():number {
                return this._color;
            }

            public set color(v:number) {
                this._color = v;
                var clr = mic.Color.fromNumber(v);
                this._updateColorMatrix(clr.r, clr.g, clr.b, this.alpha);
            }

            public inner:boolean;
            public knockout:boolean;

            public get quality():number {
                return this._f2.passes;
            }

            public set quality(v:number) {
                this._f2.passes = v;
            }

            public strength:number;

            public constructor(color:number = 0xff0000, alpha:number = 1.0, blurX:number = 6.0, blurY:number = 6.0,
                               strength:number = 2, quality:number = BitmapFilterQuality.LOW, inner:boolean = false, knockout:boolean = false) {
                super();
                this._f1 = new PIXI.filters.ColorMatrixFilter();
                this._f2 = new PIXI.filters.BlurFilter();
                this._f3 = new PIXI.filters.ColorMatrixFilter();
                this.color = color;
                this.alpha = mic.util.limit(alpha, 0, 1);
                this.blurX = blurX;
                this.blurY = blurY;
                this.strength = strength;
                this.quality = quality;
                this.inner = inner;
                this.knockout = knockout;
            }

            public clone():GlowFilter {
                return new GlowFilter(this.color, this.alpha, this.blurX, this.blurY,
                    this.strength, this.quality, this.inner, this.knockout);
            }

            public get filterType():string {
                return BitmapFilter.FILTER_GLOW;
            }

            // Bulletproof, PIXI
            // See PIXI.filters.BlurFilter
            public applyFilter(renderer:PIXI.WebGLRenderer, input:PIXI.RenderTarget, output:PIXI.RenderTarget, clear?:boolean):void {
                var renderTarget = renderer.filterManager.getRenderTarget(true);
                this._f1.applyFilter(renderer, input, renderTarget);
                this._f2.applyFilter(renderer, renderTarget, output);
                this._f3.applyFilter(renderer, input, output);
                // type casting: trick
                (<any>renderer.filterManager).returnRenderTarget(renderTarget);
            }

            private _updateColorMatrix(r:number, g:number, b:number, a:number):void {
                this._f1.matrix = [
                    0, 0, 0, r, 0,
                    0, 0, 0, g, 0,
                    0, 0, 0, b, 0,
                    0, 0, 0, a, 0
                ];
            }

        }

        export class BlurFilter extends BitmapFilter {

            private _f1:PIXI.filters.BlurFilter;

            public get blurX():number {
                return this._f1.blurX;
            }

            public set blurX(v:number) {
                this._f1.blurX = v;
            }

            public get blurY():number {
                return this._f1.blurY;
            }

            public set blurY(v:number) {
                this._f1.blurY = v;
            }

            public get quality():number {
                return this._f1.passes;
            }

            public set quality(v:number) {
                this._f1.passes = v;
            }

            public constructor(blurX:number = 4.0, blurY:number = 4.0, quality:number = BitmapFilterQuality.LOW) {
                super();
                this._f1 = new PIXI.filters.BlurFilter();
                this.blurX = blurX;
                this.blurY = blurY;
                this.quality = quality;
            }

            public clone():BlurFilter {
                return new BlurFilter(this.blurX, this.blurY, this.quality);
            }

            public get filterType():string {
                return BitmapFilter.FILTER_BLUR;
            }

            // Bulletproof
            public get pixiFilters():Array<PIXI.AbstractFilter> {
                return [this._f1];
            }

            // Bulletproof, PIXI
            public applyFilter(renderer:PIXI.WebGLRenderer, input:PIXI.RenderTarget, output:PIXI.RenderTarget, clear?:boolean):void {
                return this._f1.applyFilter(renderer, input, output, clear);
            }

        }

    }

    export module text {

        export class TextFormat {

            public align:string;
            public blockIndent:number;
            public bold:boolean;
            public bullet:boolean;
            public color:number;
            public font:string;
            public indent:number;
            public italic:boolean;
            public kerning:boolean;
            public leading:number;
            public leftMargin:number;
            public letterSpacing:number;
            public rightMargin:number;
            public size:number;
            public tabStops:Array<number>;
            public target:string;
            public underline:boolean;
            public url:string;

            public constructor(font:string = null, size:number = null, color:number = null, bold:boolean = null,
                               italic:boolean = null, underline:boolean = null, url:string = null, target:string = null,
                               align:string = null, leftMargin:number = null, rightMargin:number = null,
                               indent:number = null, leading:number = null) {
                this.__init();
                (font != null) && (this.font = font);
                (size != null) && (this.size = size);
                (color != null) && (this.color = color);
                (bold != null) && (this.bold = bold);
                (italic != null) && ( this.italic = italic);
                (underline != null) && (this.underline = underline);
                (url != null) && ( this.url = url);
                (target != null) && ( this.target = target);
                (align != null) && ( this.align = align);
                (leading != null) && (this.leading = leftMargin);
                (rightMargin != null) && (this.rightMargin = rightMargin);
                (indent != null) && (this.indent = indent);
                (leading != null) && (this.leading = leading);
            }

            private __init():void {
                this.align = TextFormatAlign.LEFT;
                this.blockIndent = 0;
                this.bold = false;
                this.bullet = false;
                this.color = 0x000000;
                this.font = 'Times New Roman'; // 'Times' on Mac
                this.indent = 0;
                this.italic = false;
                this.kerning = false;
                this.leading = 0;
                this.leftMargin = 0;
                this.letterSpacing = 0;
                this.rightMargin = 0;
                this.size = 12;
                this.tabStops = [];
                this.target = '';
                this.underline = false;
                this.url = '';
            }

        }

        export class TextFormatAlign {

            public static get CENTER():string {
                return 'center';
            }

            public static get END():string {
                return 'end';
            }

            public static get JUSTIFY():string {
                return 'justify';
            }

            public static get LEFT():string {
                return 'left';
            }

            public static get RIGHT():string {
                return 'right';
            }

            public static get START():string {
                return 'start';
            }

        }

        export class TextSnapshot {

            private _text:string;

            public get charCount():number {
                return this._text != null ? this._text.length : 0;
            }

            public findText(beginIndex:number, textToFind:string, caseSensitive:boolean):number {
                throw new NotImplementedError();
            }

            public getSelected(beginIndex:number, endIndex:number):boolean {
                throw new NotImplementedError();
            }

            public getSelectedText(includeLineEndings:boolean = false):string {
                throw new NotImplementedError();
            }

            public getTextRunInfo(beginIndex:number, endIndex:number):Array<Object> {
                throw new NotImplementedError();
            }

            public hitTestTextNearPos(x:number, y:number, maxDistance:number = 0):number {
                throw new NotImplementedError();
            }

            public setSelectColor(hexColor:number = 0xffff00):void {
                throw new NotImplementedError();
            }

            public setSelected(beginIndex:number, endIndex:number, selected:boolean):void {
                throw new NotImplementedError();
            }

        }

    }

    export module display {

        export interface IBitmapDrawable {
        }

        export interface IGraphicsData {
            // http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/flash/display/IGraphicsData.html
            // 空的，仅作为类型约束
        }

        export interface IGraphicsPath {
            // http://help.adobe.com/zh_CN/FlashPlatform/reference/actionscript/3/flash/display/IGraphicsPath.html
            // 空的，仅作为类型约束
        }

        export interface NativeMenu {
        }

        export interface NativeWindow extends Window {
        }

        export class DisplayObject extends events.EventDispatcher implements IBitmapDrawable {

            protected _blendShader:Shader;
            protected _height:number;
            protected _loaderInfo:LoaderInfo;
            protected _parent:DisplayObjectContainer;
            protected _root:DisplayObject;
            protected _name:string;
            protected _rotation:number;
            protected _rotationX:number;
            protected _rotationY:number;
            protected _rotationZ:number;
            protected _scaleX:number;
            protected _scaleY:number;
            protected _scaleZ:number;
            protected _stage:Stage;
            protected _width:number;
            protected _x:number = 0;
            protected _y:number = 0;
            protected _z:number = 0;
            protected _childIndex:number;
            protected _pixiObject:PIXI.DisplayObject;

            public constructor(root:DisplayObject, parent:DisplayObjectContainer) {
                super();
                this._pixiObject = this._getNewPixiObject();
                this._root = root;
                this._parent = parent;
                if (parent != null) {
                    this._childIndex = parent.numChildren;
                    parent.addChild(this);
                }
            }

            // Bulletproof
            protected _getNewPixiObject():PIXI.DisplayObject {
                return new PIXI.DisplayObject();
            }

            // Bulletproof
            public draw():void {
            }

            // Bulletproof
            protected drawInternal():void {
            }

            public accessibilityProperties:accessibility.AccessibilityProperties;

            public get alpha():number {
                return this._pixiObject.alpha;
            }

            public set alpha(v:number) {
                this._pixiObject.alpha = v;
            }

            public blendMode:string;

            public set blendShader(v:Shader) {
                this._blendShader = v;
            }

            public get cacheAsBitmap():boolean {
                return this._pixiObject.cacheAsBitmap;
            }

            public set cacheAsBitmap(v:boolean) {
                this._pixiObject.cacheAsBitmap = v;
            }

            // Bulletproof
            public get childIndex():number {
                return this._childIndex;
            }

            // Bulletproof
            // DO NOT call manually
            public set childIndex(v:number) {
                this._childIndex = v;
            }

            public get filters():Array<filters.BitmapFilter> {
                return <Array<filters.BitmapFilter>>this._pixiObject.filters;
            }

            public set filters(v:Array<filters.BitmapFilter>) {
                this._pixiObject.filters = v;
            }

            public get height():number {
                return this._height;
            }

            public set height(v:number) {
                this._height = v;
            }

            public get loaderInfo():LoaderInfo {
                return this._loaderInfo;
            }

            public mask:DisplayObject;
            public metaData:Object;

            public get mouseX():number {
                throw new NotImplementedError();
            }

            public get mouseY():number {
                throw new NotImplementedError();
            }

            public get name():string {
                return this._name;
            }

            public set name(v:string) {
                this._name = v;
            }

            public opaqueBackground:Object;

            public get parent():DisplayObjectContainer {
                return this._parent;
            }

            public get root():DisplayObject {
                return this._root;
            }

            public get rotation():number {
                return this._rotation;
            }

            public set rotation(v:number) {
                while (v < -180) {
                    v += 360;
                }
                while (v > 180) {
                    v -= 360;
                }
                this._rotation = v;
            }

            public get rotationX():number {
                return this._rotationX;
            }

            public set rotationX(v:number) {
                while (v < -180) {
                    v += 360;
                }
                while (v > 180) {
                    v -= 360;
                }
                this._rotationX = v;
            }

            public get rotationY():number {
                return this._rotationY;
            }

            public set rotationY(v:number) {
                while (v < -180) {
                    v += 360;
                }
                while (v > 180) {
                    v -= 360;
                }
                this._rotationY = v;
            }

            public get rotationZ():number {
                return this._rotationZ;
            }

            public set rotationZ(v:number) {
                while (v < -180) {
                    v += 360;
                }
                while (v > 180) {
                    v -= 360;
                }
                this._rotationZ = v;
            }

            public scale9Grid:geom.Rectangle;

            private get scaleX():number {
                throw new NotImplementedError();
            }

            private set scaleX(v:number) {
                throw new NotImplementedError();
            }

            private get scaleY():number {
                throw new NotImplementedError();
            }

            private set scaleY(v:number) {
                throw new NotImplementedError();
            }

            private get scaleZ():number {
                throw new NotImplementedError();
            }

            private set scaleZ(v:number) {
                throw new NotImplementedError();
            }

            public scrollRect:geom.Rectangle;

            public get stage():Stage {
                return this._stage;
            }

            public transform:geom.Transform;
            public visible:boolean;

            public get width():number {
                return this._width;
            }

            public set width(v:number) {
                this._width = v;
            }

            public get x():number {
                return this._pixiObject.x;
            }

            public set x(v:number) {
                this._pixiObject.x = v;
            }

            public get y():number {
                return this._pixiObject.y;
            }

            public set y(v:number) {
                this._pixiObject.y = v;
            }

            public get z():number {
                return this._z;
            }

            public set z(v:number) {
                this._z = v;
            }

            public getBounds(targetCoordinateSpace:DisplayObject):geom.Rectangle {
                throw new NotImplementedError();
            }

            public getRect(targetCoordinateSpace:DisplayObject):geom.Rectangle {
                throw new NotImplementedError();
            }

            public globalToLocal(point:geom.Point):geom.Point {
                throw new NotImplementedError();
            }

            public globalToLocal3D(point:geom.Point):geom.Vector3D {
                throw new NotImplementedError();
            }

            public hitTestObject(obj:DisplayObject):boolean {
                throw new NotImplementedError();
            }

            public hitTestPoint(x:number, y:number, shapeFlag:boolean = false):boolean {
                throw new NotImplementedError();
            }

            public local3DToGlobal(point3d:geom.Vector3D):geom.Point {
                throw new NotImplementedError();
            }

            public localToGlobal(point:geom.Point):geom.Point {
                throw new NotImplementedError();
            }

            // Bulletproof
            public get pixiObject():PIXI.DisplayObject {
                return this._pixiObject;
            }

        }

        export class InteractiveObject extends DisplayObject {

            public accessibilityImplementation:accessibility.AccessibilityImplementation;
            public contextMenu:NativeMenu;
            public doubleClickEnabled:boolean;
            public focusRect:boolean;
            public mouseEnabled:boolean;
            public needsSoftKeyboard:boolean;
            public tabEnabled:boolean;
            public tabIndex:number;

            public constructor(root:DisplayObject, parent:DisplayObjectContainer) {
                super(root, parent);
            }

            public requestSoftKeyboard():boolean {
                return false;
            }

        }

        export class DisplayObjectContainer extends InteractiveObject {

            protected _children:Array<DisplayObject> = [];
            // This is trick since this TypeScript statement will not be converted to any JavaScript statement
            // after compilation, but will affect TypeScript parsers.
            protected _pixiObject:PIXI.Container;

            public constructor(root:DisplayObject, parent:DisplayObjectContainer) {
                super(root, parent);
            }

            protected _getNewPixiObject():PIXI.Container {
                return new PIXI.Container();
            }

            public dispatchEvent(event:Event, data?:any):boolean {
                var r = super.dispatchEvent(event, data);
                var len = this.numChildren;
                for (var i = 0; i < len; i++) {
                    this._children[i].dispatchEvent(event, data);
                }
                return r;
            }

            // Bulletproof
            public draw():void {
                this.drawInternal();
                var l = this.numChildren;
                for (var i = 0; i < l; i++) {
                    this._children[i].draw();
                }
            }

            public mouseChildren:boolean;

            public get numChildren():number {
                return this._children.length;
            }

            public tabChildren:boolean;

            public get textSnapshot():text.TextSnapshot {
                throw new NotImplementedError();
            }

            public addChild(child:DisplayObject):DisplayObject {
                if (this._children.indexOf(child) < 0) {
                    this._children.push(child);
                    this._pixiObject.addChild(child.pixiObject);
                }
                return child;
            }

            public addChildAt(child:DisplayObject, index:number):DisplayObject {
                if (this._children.indexOf(child) < 0) {
                    this._children = this._children.slice(0, index - 1).concat(child).concat(this._children.slice(index, this._children.length - 1));
                    this._pixiObject.addChildAt(child.pixiObject, index);
                }
                return child;
            }

            public areInaccessibleObjectsUnderPoint(point:geom.Point):boolean {
                throw new NotImplementedError();
            }

            public contains(child:DisplayObject):boolean {
                throw new NotImplementedError();
            }

            public getChildAt(index:number):DisplayObject {
                throw new NotImplementedError();
            }

            public getChildByName(name:string):DisplayObject {
                throw new NotImplementedError();
            }

            public getChildIndex(child:DisplayObject):number {
                throw new NotImplementedError();
            }

            public getObjectsUnderPoint(point:geom.Point):Array<DisplayObject> {
                throw new NotImplementedError();
            }

            public removeChild(child:DisplayObject):DisplayObject {
                if (this._children.indexOf(child) >= 0) {
                    var childIndex = child.childIndex;
                    for (var i = child.childIndex + 1; i < this._children.length; i++) {
                        this._children[i].childIndex++;
                    }
                    this._children.splice(childIndex, 1);
                    this._pixiObject.removeChild(child.pixiObject);
                    return child;
                } else {
                    return null;
                }
            }

            public removeChildAt(index:number):DisplayObject {
                throw new NotImplementedError();
            }

            public setChildIndex(child:DisplayObject, index:number):void {
                throw new NotImplementedError();
            }

            public swapChildren(child1:DisplayObject, child2:DisplayObject):void {
                throw new NotImplementedError();
            }

            public swapChildrenAt(index1:number, index2:number):void {
                throw new NotImplementedError();
            }

            public get width():number {
                return this._pixiObject.width;
            }

            public set width(v:number) {
                this._pixiObject.width = v;
            }

            public get height():number {
                return this._pixiObject.height;
            }

            public set height(v:number) {
                this._pixiObject.height = v;
            }

            // Bulletproof
            public get pixiObject():PIXI.Container {
                return this._pixiObject;
            }

        }

        export class Stage extends DisplayObjectContainer {

            private _allowFullScreen:boolean;
            private _allowFullScreenInteractive:boolean;
            private _colorCorrectionSupport:string;
            private _stageHeight:number;
            private _stageWidth:number;
            private _renderer:PIXI.WebGLRenderer;

            public constructor(renderer:PIXI.WebGLRenderer) {
                // 注意这里可能引起了循环引用，请手工释放
                super(null, null);
                this._root = this; // forced (= =)#
                this._renderer = renderer;
            }

            // Bulletproof
            public raiseEnterFrame() {
                var event = mic.util.createTestEvent(events.FlashEvent.ENTER_FRAME);
                this.dispatchEvent(event);
            }

            // Bulletproof
            public redraw() {
                this._renderer.render(this._pixiObject);
            }

            public align:string;

            public get allowFullScreen():boolean {
                return this._allowFullScreen;
            }

            public get allowFullScreenInteractive():boolean {
                return this._allowFullScreenInteractive;
            }

            public color:number;
            public colorCorrection:string;

            public get colorCorrectionSupport():string {
                return this._colorCorrectionSupport;
            }

            public displayState:string;
            public focus:InteractiveObject;
            public frameRate:number;

            public get fullScreenHeight():number {
                return screen.height;
            }

            public fullScreenSourceRect:geom.Rectangle;

            public get fullScreenWidth():number {
                return screen.width;
            }

            public mouseChildren:boolean;

            public get nativeWindow():NativeWindow {
                return window;
            }

            public quality:string;
            public scaleMode:string;
            public showDefaultContextMenu:boolean;

            public get softKeyboardRect():geom.Rectangle {
                throw new NotImplementedError();
            }

            public get stageHeight():number {
                throw new NotImplementedError();
            }

            public set stageHeight(v:number) {
                throw new NotImplementedError();
            }

            public get stageVideos():Array<media.StageVideo> {
                throw new NotImplementedError();
            }

            public get stageWidth():number {
                throw new NotImplementedError();
            }

            public set stageWidth(v:number) {
                throw new NotImplementedError();
            }

            public tabChildren:boolean;

            public get textSnapshot():text.TextSnapshot {
                throw new NotImplementedError();
            }

            public get x():number {
                console.warn('Stage.x is always 0.');
                return 0;
            }

            public set x(v:number) {
                console.warn('Stage.x cannot be set manually.');
            }

            public get y():number {
                console.warn('Stage.y is always 0.');
                return 0;
            }

            public set y(v:number) {
                console.warn('Stage.y cannot be set manually.');
            }

            public invalidate():void {
                throw new NotImplementedError();
            }

            public isFocusInaccessible():boolean {
                throw new NotImplementedError();
            }

        }

        export class StageAlign {

            public static get BOTTOM():string {
                return 'B';
            }

            public static get BOTTOM_LEFT():string {
                return 'BL';
            }

            public static get BOTTOM_RIGHT():string {
                return 'BR';
            }

            public static get LEFT():string {
                return 'L';
            }

            public static get RIGHT():string {
                return 'R';
            }

            public static get TOP():string {
                return 'T';
            }

            public static get TOP_LEFT():string {
                return 'TL';
            }

            public static get TOP_RIGHT():string {
                return 'TR';
            }

        }

        export class ColorCorrection {

            public static get DEFAULT():string {
                return 'default';
            }

            public static get OFF():string {
                return 'off';
            }

            public static get ON():string {
                return 'on';
            }

        }

        export class ColorCorrectionSupport {

            public static get DEFAULT_OFF():string {
                return 'defaultOff';
            }

            public static get DEFAULT_ON():string {
                return 'defaultOn';
            }

            public static get UNSUPPORTED():string {
                return 'unsupported';
            }

        }

        export class StageDisplayState {

            public static get FULL_SCREEN():string {
                return 'fullScreen';
            }

            public static get FULL_SCREEN_INTERACTIVE():string {
                return 'fullScreenInteractive';
            }

            public static get NORMAL():string {
                return 'normal';
            }

        }

        export class StageQuality {

            public static get BEST():string {
                return 'best';
            }

            public static get HIGH():string {
                return 'high';
            }

            public static get LOW():string {
                return 'low';
            }

            public static get MEDIUM():string {
                return 'medium';
            }

        }

        export class StageScaleMode {

            public static get EXACT_FIT():string {
                return 'exactFit';
            }

            public static get NO_BORDER():string {
                return 'noBorder';
            }

            public static get NO_SCALE():string {
                return 'noScale';
            }

            public static get SHOW_ALL():string {
                return 'showAll';
            }

        }

        export class GradientType {

            public static get LINEAR():string {
                return 'linear';
            }

            public static get RADIAL():string {
                return 'radial';
            }

        }

        export class InterpolationMethod {

            public static get LINEAR_RGB():string {
                return 'linearRGB';
            }

            public static get RGB():string {
                return 'rgb';
            }

        }

        export class SpreadMethod {

            public static get PAD():string {
                return 'pad';
            }

            public static get REFLECT():string {
                return 'reflect';
            }

            public static get REPEAT():string {
                return 'repeat';
            }

        }

        export class GraphicsPathWinding {

            public static get EVEN_ODD():string {
                return 'evenOdd';
            }

            public static get NON_ZERO():string {
                return 'nonZero';
            }

        }

        export class GraphicsPathCommand {

            public static get CUBIC_CURVE_TO():number {
                return 6;
            }

            public static get CURVE_TO():number {
                return 3;
            }

            public static get LINE_TO():number {
                return 2;
            }

            public static get MOVE_TO():number {
                return 1;
            }

            public static get NO_OP():number {
                return 0;
            }

            public static get WIDE_LINE_TO():number {
                return 5;
            }

            public static get WIDE_MOVE_TO():number {
                return 4;
            }

        }

        export class TriangleCulling {

            public static get NEGATIVE():string {
                return 'negative';
            }

            public static get NONE():string {
                return 'none';
            }

            public static get POSITIVE():string {
                return 'positive';
            }

        }

        export class LineScaleMode {

            public static get HORIZONTAL():string {
                return 'horizontal';
            }

            public static get NONE():string {
                return 'none';
            }

            public static get NORMAL():string {
                return 'normal';
            }

            public static get VERTICAL():string {
                return 'vertical';
            }

        }

        export class CapsStyle {

            public static get NONE():string {
                return 'none';
            }

            public static get ROUND():string {
                return 'round';
            }

            public static get SQUARE():string {
                return 'square';
            }

        }

        export class JointStyle {

            public static get BEVEL():string {
                return 'bevel';
            }

            public static get MITER():string {
                return 'miter';
            }

            public static get ROUND():string {
                return 'round';
            }

        }

        export class BitmapData implements IBitmapDrawable {
        }

        export class Bitmap extends DisplayObject {
        }

        // Bulletproof: Non-standard inheritance
        export class Shape extends DisplayObjectContainer {

            private _graphics:Graphics;

            public constructor(root:DisplayObject, parent:DisplayObjectContainer) {
                super(root, parent);
                this._graphics = new Graphics(this);
            }

            public get graphics():Graphics {
                return this._graphics;
            }

        }

        export class GraphicsTrianglePath implements IGraphicsPath, IGraphicsData {

            public culling:string;
            public indices:Array<number>;
            public uvtData:Array<number>;
            public vertices:Array<number>;

            public constructor(vertices:Array<number> = null, indices:Array<number> = null, uvtData:Array<number> = null, culling:string = TriangleCulling.NONE) {
                this.vertices = vertices;
                this.indices = indices;
                this.uvtData = uvtData;
                this.culling = culling;
            }

        }

        /**
         * Bulletproof
         */
        interface IGraphicsSettings {

            fillStyle:string|CanvasPattern|CanvasGradient;
            strokeStyle:string|CanvasPattern|CanvasGradient;
            lineWidth:number;
            lineJoin:string;
            miterLimit:number;
            font:string;

        }

        export class Graphics implements ICopyable<Graphics> {

            private _displayObjectContainer:DisplayObjectContainer;
            private static _bp_defaultGraphicsSettings:IGraphicsSettings = {
                fillStyle: "#000000",
                strokeStyle: "#000000",
                lineWidth: 1,
                lineJoin: JointStyle.MITER,
                miterLimit: 10,
                font: "10px sans-serif"
            };
            private _pixiGraphics:PIXI.Graphics;

            public constructor(attachedDisplayObjectContainer:DisplayObjectContainer) {
                this._displayObjectContainer = attachedDisplayObjectContainer;
                this._pixiGraphics = new PIXI.Graphics();
                attachedDisplayObjectContainer.pixiObject.addChild(this._pixiGraphics);
            }

            private static _bp_getSettings(context:CanvasRenderingContext2D):IGraphicsSettings {
                return {
                    fillStyle: context.fillStyle,
                    strokeStyle: context.strokeStyle,
                    lineWidth: context.lineWidth,
                    lineJoin: context.lineJoin,
                    miterLimit: context.miterLimit,
                    font: context.font
                };
            }

            private static _bp_setSettings(context:CanvasRenderingContext2D, settings:IGraphicsSettings):void {
                context.fillStyle = settings.fillStyle;
                context.strokeStyle = settings.strokeStyle;
                context.lineWidth = settings.lineWidth;
                context.lineJoin = settings.lineJoin;
                context.miterLimit = settings.miterLimit;
                context.font = settings.font;
            }

            public beginBitmapFill(bitmap:BitmapData, matrix:geom.Matrix = null, repeat:boolean = false, smooth:boolean = false):void {
                throw new NotImplementedError();
            }

            public beginFill(color:number, alpha:number = 1.0):void {
                this._pixiGraphics.beginFill(color, alpha);
            }

            public beginGradientFill(type:string, colors:Array<number>, alphas:Array<number>, ratios:Array<number>,
                                     matrix:geom.Matrix = null, spreadMethod:string = SpreadMethod.PAD,
                                     interpolationMethod:string = InterpolationMethod.RGB, focalPointRatio:number = 0):void {
                // Gradient fill is not supported in PIXI
                throw new NotImplementedError();
            }

            public beginShaderFill(shader:Shader, matrix:geom.Matrix = null):void {
                throw new NotImplementedError();
            }

            public clear():void {
                this._pixiGraphics.clear();
            }

            public copyFrom(sourceGraphics:Graphics) {
                throw new NotImplementedError();
            }

            public curveTo(controlX:number, controlY:number, anchorX:number, anchorY:number):void {
                this._pixiGraphics.quadraticCurveTo(controlX, controlY, anchorX, anchorY);
            }

            public drawCircle(x:number, y:number, radius:number):void {
                this._pixiGraphics.drawCircle(x, y, radius);
            }

            public drawEllipse(x:number, y:number, width:number, height:number):void {
                this._pixiGraphics.drawEllipse(x, y, width, height);
            }

            public drawGraphicsData(graphicsData:Array<IGraphicsData>):void {
                throw new NotImplementedError();
            }

            /**
             *
             * @param commands
             * @param data
             * @param winding
             * @param checkCommands Bulletproof
             */
            public drawPath(commands:Array<number>, data:Array<number>, winding:string = GraphicsPathWinding.EVEN_ODD, checkCommands:boolean = true):void {
                if (checkCommands && !Graphics._bp_checkPathCommands(commands, data)) {
                    return;
                }
                var commandLength = commands.length;
                var j = 0;
                for (var i = 0; i < commandLength; i++) {
                    switch (commands[i]) {
                        case GraphicsPathCommand.CUBIC_CURVE_TO:
                            this._pixiGraphics.bezierCurveTo(data[j], data[j + 1], data[j + 2], data[j + 3], data[j + 4], data[j + 5]);
                            j += 6;
                            break;
                        case GraphicsPathCommand.CURVE_TO:
                            this._pixiGraphics.quadraticCurveTo(data[j], data[j + 1], data[j + 2], data[j + 3]);
                            j += 4;
                            break;
                        case GraphicsPathCommand.LINE_TO:
                            // HACK: please update the x and y properties
                            //context.lineTo(data[j] + this._displayObject.x, data[j + 1] + this._displayObject.y);
                            this._pixiGraphics.lineTo(data[j], data[j + 1]);
                            j += 2;
                            break;
                        case GraphicsPathCommand.MOVE_TO:
                            // HACK: please update the x and y properties
                            //context.moveTo(data[j] + this._displayObject.x, data[j + 1] + this._displayObject.y);
                            this._pixiGraphics.moveTo(data[j], data[j + 1]);
                            j += 2;
                            break;
                        case GraphicsPathCommand.NO_OP:
                            break;
                        case GraphicsPathCommand.WIDE_LINE_TO:
                            this._pixiGraphics.lineTo(data[j + 2], data[j + 3]);
                            j += 4;
                            break;
                        case GraphicsPathCommand.WIDE_MOVE_TO:
                            this._pixiGraphics.moveTo(data[j + 2], data[j + 3]);
                            j += 4;
                            break;
                        default:
                            break;
                    }
                }
            }

            private static _bp_checkPathCommands(commands:Array<number>, data:Array<number>):boolean {
                if (commands == null || data == null || data.length % 2 != 0) {
                    return false;
                }
                var commandLength = commands.length;
                var dataLength = data.length;
                for (var i = 0; i < commandLength; i++) {
                    switch (commands[i]) {
                        case GraphicsPathCommand.CUBIC_CURVE_TO:
                            dataLength -= 2 * 3;
                            if (dataLength < 0) {
                                return false;
                            }
                            break;
                        case GraphicsPathCommand.CURVE_TO:
                            dataLength -= 2 * 2;
                            if (dataLength < 0) {
                                return false;
                            }
                            break;
                        case GraphicsPathCommand.LINE_TO:
                            dataLength -= 2 * 1;
                            if (dataLength < 0) {
                                return false;
                            }
                            break;
                        case GraphicsPathCommand.MOVE_TO:
                            dataLength -= 2 * 1;
                            if (dataLength < 0) {
                                return false;
                            }
                            break;
                        case GraphicsPathCommand.NO_OP:
                            break;
                        case GraphicsPathCommand.WIDE_LINE_TO:
                            dataLength -= 2 * 2;
                            if (dataLength < 0) {
                                return false;
                            }
                            break;
                        case GraphicsPathCommand.WIDE_MOVE_TO:
                            dataLength -= 2 * 2;
                            if (dataLength < 0) {
                                return false;
                            }
                            break;
                        default:
                            return false;
                    }
                }
                return true;
            }

            public drawRect(x:number, y:number, width:number, height:number):void {
                this._pixiGraphics.drawRect(x, y, width, height);
            }

            public drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight:number = NaN):void {
                if (ellipseHeight === NaN) {
                    ellipseHeight = ellipseWidth;
                }
                this._pixiGraphics.drawRoundedRect(x, y, width, height, (ellipseWidth + ellipseHeight) / 2);
            }

            public drawTriangles(vectors:Array<number>, indices:Array<number> = null, uvtData:Array<number> = null, culling:string = TriangleCulling.NONE):void {
                // jabbany, mostly
                if (indices === null) {
                    indices = [];
                    for (var i = 0; i < vectors.length; i += 2) {
                        indices.push(i / 2);
                    }
                } else {
                    indices = indices.slice(0);
                }
                if (indices.length % 3 !== 0) {
                    mic.trace("Graphics.drawTriangles malformed indices count. Must be multiple of 3.", "err");
                    return;
                }
                /** Do culling of triangles here to lessen work later **/
                if (culling !== TriangleCulling.NONE) {
                    for (var i = 0; i < indices.length / 3; i++) {
                        var ux = vectors[2 * indices[i * 3 + 1]] - vectors[2 * indices[i * 3]],
                            uy = vectors[2 * indices[i * 3 + 1] + 1] - vectors[2 * indices[i * 3] + 1],
                            vx = vectors[2 * indices[i * 3 + 2]] - vectors[2 * indices[i * 3 + 1]],
                            vy = vectors[2 * indices[i * 3 + 2] + 1] - vectors[2 * indices[i * 3 + 1] + 1];
                        var zcomp = ux * vy - vx * uy;
                        if (zcomp < 0 && culling === TriangleCulling.POSITIVE ||
                            zcomp > 0 && culling === TriangleCulling.NEGATIVE) {
                            /** Remove the indices. Leave the vertices. **/
                            indices.splice(i * 3, 3);
                            i--;
                        }
                    }
                }
                var commands = [], data = [];
                for (var i = 0; i < indices.length / 3; i++) {
                    var a = indices[3 * i],
                        b = indices[3 * i + 1],
                        c = indices[3 * i + 2];
                    var ax = vectors[2 * a], ay = vectors[2 * a + 1];
                    var bx = vectors[2 * b], by = vectors[2 * b + 1];
                    var cx = vectors[2 * c], cy = vectors[2 * c + 1];
                    commands.push(1, 2, 2, 2);
                    data.push(ax, ay, bx, by, cx, cy, ax, ay);
                }
                // 已经有 this._displayObject._bp_invalidate(); 了
                // 历史记录由 drawPath() 代为完成
                this.drawPath(commands, data, void(0), false);
            }

            public endFill():void {
                this._pixiGraphics.endFill();
            }

            public lineBitmapStyle(bitmap:BitmapData, matrix:geom.Matrix = null, repeat:boolean = true, smooth:boolean = false):void {
                throw new NotImplementedError();
            }

            public lineGradientStyle(type:string, colors:Array<number>, alphas:Array<number>, ratios:Array<number>,
                                     matrix:geom.Matrix = null, spreadMethod:string = SpreadMethod.PAD,
                                     interpolationMethod:string = InterpolationMethod.RGB, focalPointRatio:number = 0):void {
                // Gradient is not supported in PIXI
                throw new NotImplementedError();
            }

            public lineShaderStyle(shader:Shader, matrix:geom.Matrix = null):void {
                throw new NotImplementedError();
            }

            public lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false,
                             scaleMode:string = LineScaleMode.NORMAL, caps:string = null, joints:string = null, miterLimit:number = 3):void {
                this._pixiGraphics.lineStyle(thickness, color, alpha);
            }

            public lineTo(x:number, y:number):void {
                this._pixiGraphics.lineTo(x, y);
            }

            public moveTo(x:number, y:number):void {
                this._pixiGraphics.moveTo(x, y);
            }

        }

        export class LoaderInfo {

            public get actionScriptVersion():number {
                throw new NotImplementedError();
            }

            public get applicationDomain():system.ApplicationDomain {
                throw new NotImplementedError();
            }

            public get bytes():utils.ByteArray {
                throw new NotImplementedError();
            }

            public get bytesLoaded():number {
                throw new NotImplementedError();
            }

            public get bytesTotal():number {
                throw new NotImplementedError();
            }

            public get childAllowsParent():boolean {
                throw new NotImplementedError();
            }

            public childSandboxBridge:Object;

            public get content():DisplayObject {
                throw new NotImplementedError();
            }

            public get contentType():string {
                throw new NotImplementedError();
            }

            public get frameRate():number {
                throw new NotImplementedError();
            }

            public get height():number {
                throw new NotImplementedError();
            }

            public get isURLInaccessible():boolean {
                throw new NotImplementedError();
            }

            public get loader():Object {
                throw new NotImplementedError();
            }

            public get loaderURL():string {
                throw new NotImplementedError();
            }

            public get parameters():Object {
                throw new NotImplementedError();
            }

            public get parentAllowsChild():boolean {
                throw new NotImplementedError();
            }

            public parentSandboxBridge:Object;

            public get sameDomain():boolean {
                throw new NotImplementedError();
            }

            public get sharedEvents():events.EventDispatcher {
                throw new NotImplementedError();
            }

            public get swfVersion():number {
                throw new NotImplementedError();
            }

            public get uncaughtErrorEvents():events.UncaughtErrorEvents {
                throw new NotImplementedError();
            }

            public get url():string {
                throw new NotImplementedError();
            }

            public get width():number {
                throw new NotImplementedError();
            }

            public static getLoaderInfoByDefinition(object:Object):LoaderInfo {
                throw new NotImplementedError();
            }

        }

        export class Shader {

            private _byteCode:utils.ByteArray;

            public set byteCode(v:utils.ByteArray) {
                this._byteCode = v;
            }

            public data:ShaderData;
            public precisionHint:string;

            public constructor(code:utils.ByteArray = null) {
                this.byteCode = code;
            }

        }

        export class ShaderData {

            public constructor(byteCode:utils.ByteArray) {
                throw new NotImplementedError();
            }

        }

        export class ShaderPrecision {

            public static get FAST():string {
                return 'fast';
            }

            public static get FULL():string {
                return 'full';
            }

        }

        export class BlendMode {

            public static get ADD():string {
                return 'add';
            }

            public static get ALPHA():string {
                return 'alpha';
            }

            public static get DARKEN():string {
                return 'darken';
            }

            public static get DIFFERENCE():string {
                return 'difference';
            }

            public static get ERASE():string {
                return 'erase';
            }

            public static get HARDLIGHT():string {
                return 'hardlight';
            }

            public static get INVERT():string {
                return 'invert';
            }

            public static get LAYER():string {
                return 'layer';
            }

            public static get LIGHTEN():string {
                return 'lighten';
            }

            public static get MULTIPLY():string {
                return 'multiply';
            }

            public static get NORMAL():string {
                return 'normal';
            }

            public static get OVERLAY():string {
                return 'overlay';
            }

            public static get SCREEN():string {
                return 'screen';
            }

            public static get SHADER():string {
                return 'shader';
            }

            public static get SUBTRACT():string {
                return 'subtract';
            }

        }

    }

    export module utils {

        import events = bulletproof.flash.events;

        /**
         * 这个类的实现和 ActionScript 内的很不一样。考虑到我们选用的环境，我们应该使用 JavaScript 的方式实现此类。
         * 所以我们不支持事件回调之类的东西，用 JavaScript 自带的 setInterval() 解决。
         */
        export class Timer extends events.EventDispatcher {

            private _currentCount:number = 0;
            private _delay:number = 1000;
            private _repeatCount:number = 0;
            private _running:boolean = false;
            private _handle = 0;

            public get currentCount():number {
                return this._currentCount;
            }

            public get delay():number {
                return this._delay;
            }

            public set delay(v:number) {
                v = Math.floor(v);
                this._delay = v >= 0 ? v : 0;
            }

            public enabled:boolean = true;

            public get repeatCount():number {
                return this._repeatCount;
            }

            public set repeatCount(v:number) {
                v = Math.floor(v);
                this._repeatCount = v >= 0 ? v : 0;
            }

            public get running():boolean {
                return this._running;
            }

            protected _bp_timerCallbackInternal():void {
            }

            private _bp_timerCallback():void {
                if (this.enabled) {
                    this._currentCount++;
                    if (this.repeatCount > 0 && this.currentCount > this.repeatCount) {
                        this.stop();
                    } else {
                        this._bp_timerCallbackInternal();
                    }
                }
            }

            public constructor(delay:number, repeatCount:number = 0) {
                super();
                this.delay = delay;
                this.repeatCount = repeatCount;
                this._handle = 0;
                this.start();
            }

            public reset():void {
                if (this.running) {
                    clearInterval(this._handle);
                    this._handle = 0;
                    this._running = false;
                    this._currentCount = 0;
                }
            }

            public start():void {
                if (!this.running && (this.currentCount < this.repeatCount || this.repeatCount == 0)) {
                    // this 参数很关键
                    // 因为在 setInterval() 执行的函数中，this 指向了全局对象（window/Node上下文）
                    // 因此应该重设 this
                    // 可以通过 bind()，也可以通过 setInterval() 的附加参数
                    // 这里为了效率，使用 bind()（... 会导致循环展开 arguments）
                    this._handle = setInterval(this._bp_timerCallback.bind(this), this.delay);
                    this._running = true;
                }
            }

            public stop():void {
                if (this.running) {
                    clearInterval(this._handle);
                    this._handle = 0;
                    this._running = false;
                }
            }

        }

        export class ByteArray {
        }

    }

    export module accessibility {

        export class AccessibilityProperties {

            public description:string;
            public forceSimple:boolean;
            public name:string;
            public noAutoLabeling:boolean;
            public shortcut:string;
            public silent:boolean;

            public constructor() {
                this.description = '';
                this.forceSimple = false;
                this.name = '';
                this.noAutoLabeling = false;
                this.shortcut = '';
                this.silent = false;
            }

        }

        export class AccessibilityImplementation {
        }

    }

    export module media {

        import events = bulletproof.flash.events;
        import net = bulletproof.flash.net;
        import geom = bulletproof.flash.geom;

        export class StageVideo {

            public get colorSpaces():Array<string> {
                throw new NotImplementedError();
            }

            public depth:number;
            public pan:geom.Point;

            public get videoHeight():number {
                throw new NotImplementedError();
            }

            public get videoWidth():number {
                throw new NotImplementedError();
            }

            public viewPort:geom.Rectangle;
            public zoom:geom.Point;

            public attachNetStream(netStream:net.NetStream):void {
                throw new NotImplementedError();
            }

        }

        export class Sound extends events.EventDispatcher {
        }

    }

    export module net {

        export class NetStream {
        }

    }

    export module system {

        import utils = bulletproof.flash.utils;

        export class ApplicationDomain {

            public static get currentDomain():ApplicationDomain {
                throw new NotImplementedError();
            }

            public domainMemory:utils.ByteArray;

            public static get MIN_DOMAIN_MEMORY_LENGTH():number {
                throw new NotImplementedError();
            }

            public get parentDomain():ApplicationDomain {
                throw new NotImplementedError();
            }

        }

    }

}
