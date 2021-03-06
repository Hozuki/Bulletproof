/**
 * Created by MIC on 2016/1/7.
 */

import Timer from "../../../../../lib/glantern/src/gl/flash/utils/Timer";
import TimerEvent from "../../../../../lib/glantern/src/gl/flash/events/TimerEvent";

export default class FiniteTimer extends Timer {

    constructor(obj: string|Function, delay: number, repeatCount: number = 1) {
        super(delay, repeatCount);
        if (typeof obj === "string") {
            this._funcSource = <string>obj;
            this._closure = new Function(this._funcSource);
            this._closureIsFunction = false;
        } else {
            this._closure = obj;
            this._closureIsFunction = true;
        }
        this.addEventListener(TimerEvent.TIMER, this.__closureTimerHandler.bind(this));
        this.addEventListener(TimerEvent.TIMER_COMPLETE, this.__closureTimerCompleteHandler.bind(this));
    }

    protected __closureTimerHandler(): void {
        try {
            // TODO: closure 'this' problem (kanpai-full.xml -> 'g' and 'cv')
            this._closure();
        } catch (e) {
            console.error(e);
        }
    }

    protected __closureTimerCompleteHandler(): void {
        this._closure = null;
    }

    private _closure: Function = null;
    private _funcSource: string = null;
    private _closureIsFunction: boolean = false;

}
