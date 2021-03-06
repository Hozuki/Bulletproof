/**
 * Created by MIC on 2015/12/29.
 */

interface IMotionPropertyAnimation {

    fromValue: number;
    toValue?: number;
    lifeTime?: number;
    startDelay?: number;
    easing?: string;
    repeat?: number;

}

export default IMotionPropertyAnimation;
