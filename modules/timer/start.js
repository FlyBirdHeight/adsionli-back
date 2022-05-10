import DailyMail from "./mail/daily_mail.js"
import DailyUpdate from "./daily/daily_update.js"
const TimerList = [DailyMail, DailyUpdate];
import TimerHandle from "./timer.js"
var timerHandle = new TimerHandle();
/**
 * @method setData 设置相关定时器参数,并启动定时器
 * @param {*} value 定时器参数相关参数
 */
const setData = (value) => {
    if(!Array.isArray(value)){
        timerHandle.setTimerTask(v)
    }
    for(let v of value){
        if(typeof v !== 'object'){
            continue;
        }
        if(!Reflect.has(v, 'time') || !Reflect.has(v, 'callback')){
            continue
        }
        timerHandle.setTimerTask(v)
    }
}

/**
 * @method timerTaskStart 启动定时器
 */
const timerTaskStart = () => {
    TimerList.forEach((value) => {
        setData(value)
    });
}

export default timerTaskStart;
