import TimerHandle from "./timer.js"

var callbackList = new Map();
var timerHandle = new TimerHandle();
/**
 * @method setData 设置相关定时器参数,并启动定时器
 * @param {*} value 相关参数
 * @param {*} timerConfig 定时器配置相关参数
 */
function setData(value, timerConfig) {
    
}

/**
 * @method timerTaskStart 启动定时器
 */
function timerTaskStart() {
    callbackList.forEach((value, key) => {
        
    });
}

module.exports = timerTaskStart;
