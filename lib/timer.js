import { createRequire } from 'module';
const require = createRequire(import.meta.url);
var corn = require('node-cron');
class TimerHandle {
    constructor() {
        this.timerTask = new Map();
        this.startTask = new Map();
        this.stopTask = new Map();
    }
    /**
     * @method setTimerTask 设置定时任务
     * @param {*} options 定时器任务参数，包括执行时间与执行回调
     */
    async setTimerTask(options) {
        try {
            let doingTime = this.getCornTime(options.time);

            let cornTask = corn.schedule(doingTime, () => {
                if (typeof (options.callback) != 'function') {
                    throw new Error('TimeTask is error: callback is not a function！');
                } else {
                    options.callback().catch((error) => {
                        console.log(error)
                    });
                }
            })
            this.timerTask.set(options.name, {
                corn: cornTask,
                config: options
            })
            if (options.open) {
                this.startTask.set(options.name, this.timerTask.get(options.name))
            } else {
                await this.taskStop(options.name)
                this.stopTask.set(options.name, this.timerTask.get(options.name));
            }
            return true;
        } catch (e) {
            throw e;
        }
    }
    /**
     * @method taskStop 定时器任务暂停
     * @param {string[] | string} name 暂停定时器任务名称
     */
    taskStop(name) {
        if (Array.isArray(name)) {
            let promises = name.map(async (v) => {
                if (!this.timerTask.has(v)) {
                    return null;
                }
                let timer = this.timerTask.get(v);
                return await this.timerStop(timer);
            })

            return Promise.all(promises)
        }
        if (!this.timerTask.has(name)) {
            return null;
        }
        let timer = this.timerTask.get(name);
        return this.timerStop(timer);
    }

    /**
     * @method timerStop 停止定时器任务
     * @param {*} timer
     */
    timerStop(timer) {
        return new Promise((resolve, reject) => {
            try {
                timer.corn.stop();
                timer.config.open = false;
                this.stopTask.set(timer.config.name, timer);
                this.startTask.delete(timer.config.name)
                resolve(true);
            } catch (error) {
                reject(error.message);
            }
        })
    }

    /**
     * @method taskStart 定时器任务开启
     * @param {string} name 定时器名称
     */
    async taskStart(name) {
        if (Array.isArray(name)) {
            let promises = name.map(async (v) => {
                if (!this.timerTask.has(v)) {
                    return null;
                }
                let timer = this.timerTask.get(v);
                return await this.timerStart(timer);
            })

            return Promise.all(promises)
        }
        if (!this.timerTask.has(name)) {
            return null;
        }
        let timer = this.timerTask.get(name);
        return this.timerStart(timer);
    }
    /**
     * @method timerStart 开启定时器
     * @param {*} timer 等待开启的定时器
     */
    timerStart(timer) {
        return new Promise((resolve, reject) => {
            try {
                timer.corn.start();
                timer.config.open = true;
                this.startTask.set(timer.config.name, timer);
                this.stopTask.delete(timer.config.name)
                resolve(true);
            } catch (error) {
                reject(error.message);
            }
        })
    }
    /**
     * @method deleteTask 删除定时器任务
     * @param {string | string[]} name 定时器任务名称 
     */
    async deleteTask(name) {
        try {
            const hd = async (task) => {
                if (!this.timerTask.has(task)) {
                    return;
                }
                let timer = this.timerTask.get(task);
                if (timer.config.open) {
                    await this.timerStop(timer);
                }
                this.timerTask.delete(task);
                this.startTask.delete(task);
                this.stopTask.delete(task);
                timer = null;
            }
            if (Array.isArray(name)) {
                for (let v of name) {
                    await hd(v);
                }
                return true;
            }

            await hd(v);
            return true;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }



    /**
     * @method getCornTime 获取Corn形式的时间
     * @param {number} time 秒
     */
    getCornTime(time) {
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
            doingTime = `${second} ${minute} */${hour} * * *`;
        } else if (time > 86400) {
            second = time % 60;
            day = Math.floor(time / 86400);
            hour = Math.floor((time - day * 86400) / 3600);
            minute = Math.floor((time - day * 86400 - hour * 3600) / 60);
            doingTime = `${second} ${minute} ${hour} */${day} * *`
        } else {
            doingTime = `*/${time} * * * * *`
        }

        return doingTime;
    }
}

export default TimerHandle;