import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var corn = require('node-cron');
class TimerHandle {
    constructor(callback = null, time = null) {
        this.callback = callback;
        this.time = time;
        this.timerTask = new Object;
        this.threshold = undefined;
    }

    /**
     * @method setCallBack 设置回调参数
     * @param {*} callback 回调方法
     */
    setCallBack(callback) {
        this.callback = callback;
        return this;
    }
    /**
     * @method setTime 设置回调参数
     * @param {*} time 轮循时间
     */
    setTime(time) {
        this.time = time;

        return this;
    }
    /**
     * @method setTimerTaskForStart 项目启动时设置定时任务
     * @param {*} callback 执行回调方法
     * @param {Number} time 轮询时间
     * @param {*} threshold 阈值设置
     */
    setTimerTaskForStart(callback, time, threshold) {
        let second = undefined;
        let minute = undefined;
        let hour = undefined;
        let day = undefined;
        let doingTime = '';
        if (time > 59 && time < 3601) {
            second = time % 60;
            minute = Math.floor(time / 60);
            doingTime = `${second} */${minute} * * * *`;
        } else if (time > 3600 && time < 86401) {
            second = time % 60;
            hour = Math.floor(time / 3600);
            minute = Math.floor((time - hour * 3600) / 60);
            doingTIme = `${second} ${minute} */${hour} * * *`;
        } else if (time > 86400) {
            second = time % 60;
            day = Math.floor(time / 86400);
            hour = Math.floor((time - day * 86400) / 3600);
            minute = Math.floor((time - day * 86400 - hour * 3600) / 60);
            doingTime = `${second} ${minute} ${hour} */${day} * *`
        } else {
            doingTime = `*/${time} * * * * *`
        }
        this.timerTask['task'] = corn.schedule(doingTime, () => {
            if (typeof (callback) != 'function') {
                throw new Error('TimeTask is error: callback is not a function！');
            } else {
                callback(threshold).then((res) => {
                    console.log('select data is success, please set in socket to web!');
                }).catch((error) => {
                    console.log(error)
                });
            }
        })
        this.timerTask['status'] = 'running';

        return true;
    }
    /**
     * @method setTimerTask 设置定时任务
     */
    setTimerTask() {
        let second = undefined;
        let minute = undefined;
        let hour = undefined;
        let day = undefined;
        let doingTime = '';
        if (this.time > 59 && this.time < 3601) {
            second = this.time % 60;
            minute = Math.floor(this.time / 60);
            doingTime = `${second} */${minute} * * * *`;
        } else if (this.time > 3600 && this.time < 86401) {
            second = this.time % 60;
            hour = Math.floor(this.time / 3600);
            minute = Math.floor((this.time - hour * 3600) / 60);
            doingTIme = `${second} ${minute} */${hour} * * *`;
        } else if (this.time > 86400) {
            second = this.time % 60;
            day = Math.floor(this.time / 86400);
            hour = Math.floor((this.time - day * 86400) / 3600);
            minute = Math.floor((this.time - day * 86400 - hour * 3600) / 60);
            doingTime = `${second} ${minute} ${hour} */${day} * *`
        } else {
            doingTime = `*/${this.time} * * * * *`
        }
        this.timerTask['task'] = corn.schedule(doingTime, () => {
            if (typeof (this.callback) != 'function') {
                throw new Error('TimeTask is error: callback is not a function！');
            } else {
                this.callback(this.threshold).then((res) => {
                    console.log(res);
                    console.log('select data is success, please set in socket to web!');
                }).catch((error) => {
                    console.log(error)
                });
            }
        })
        this.timerTask['status'] = 'running';

        return true;
    }
    /**
     * @method taskStop 定时器任务暂停
     */
    taskStop() {
        return new Promise((resolve, reject) => {
            try {
                if (this.timerTask['status'] == 'stop') {
                    reject('Task has been stopped！');
                } else {
                    this.timerTask['task'].stop();
                    this.timerTask['status'] = 'stop';
                    resolve(true);
                }

            } catch (error) {
                reject(error.message);
            }
        })
    }
    /**
     * @method taskStart 定时器任务开启
     */
    taskStart() {
        return new Promise((resolve, reject) => {
            try {
                if (this.timerTask['status'] == 'stop') {
                    this.timerTask['task'].start();
                    this.timerTask['status'] = 'running';
                    resolve(true)
                } else {
                    reject('Task has been started！');
                }
            } catch (error) {
                reject(error.message)
            }
        })
    }
}

export default TimerHandle;