import path from "path";
import os from "os";
import { Worker } from "worker_threads";
import EventEmitter from "events";

const status = {
    CREATE: 0,
    SLEEP: 1,
    WORK: 2,
    ERROR: 3
}
// 线程池状态
const WorkerPoolStates = {
    TODO: 0,
    READY: 1,
    OFF: 2
};

class WorkerPool {
    constructor(numOfThreads = os.cpus().length >> 1) {
        this.runFunc = null;
        this.options = null;
        this.numOfThreads = numOfThreads;
        this.state = WorkerPoolStates.TODO;
        /**
         * @property {{status: string,worker:Worker}[]} _workers 线程使用数组
         * @property {any[]} _queue 排队中的任务队列
         */
        this._workers = [];
        this._queue = [];
        this.init();
    }
    /**
     * @method init 初始化线程
     */
    async init() {
        try {
            await new Promise((resolve, reject) => {
                if (this.numOfThreads < 1) {
                    reject(new Error("线程池最小线程数必须大于等于1"));
                }

                let event = new EventEmitter();
                let successCount = 0;
                let failedCount = 0;

                event.on("spawning", (isSuccess, ErrorReason) => {
                    if (isSuccess) {
                        ++successCount;
                    } else {
                        ++failedCount;
                    }
                    // 如果所有线程都创建失败，那么直接抛出
                    if (failedCount == this.numOfThreads) {
                        this.state = WorkerPoolStates.OFF;
                        reject(new Error(ErrorReason));
                    }
                    // 至少一个线程创建成功即可
                    else if (successCount != 0 && successCount + failedCount == this.numOfThreads) {
                        this.state = WorkerPoolStates.READY;
                        resolve(true);
                    }
                });

                for (let i = 0; i < this.numOfThreads; i++) {
                    //NOTE: 创建线程
                    const worker = new Worker(path.resolve(global.__dirname, './workers/utils/worker.js'));
                    worker.on('online', (index => () => {
                        this._workers[index].status = status.SLEEP;
                        this._workers[index].worker.removeAllListeners();
                        this._workers[index].worker.unref();
                        event.emit("spawning", true);
                    })(i))

                    worker.on('error', (index => (ErrorReason) => {
                        this._workers[index].status = status.ERROR;
                        this._workers[index].worker.removeAllListeners();
                        event.emit("spawning", false, ErrorReason);
                    })(i))
                    this._workers[i] = {
                        status: status.CREATE,
                        worker
                    };

                }
            })
            return true;
        } catch (e) {
            console.log(e)
        }
    }
    /**
     * @method destroyed 关闭线程
     */
    destroyed() {
        for (let i = 0; i < this.numOfThreads; i++) {
            if (this._workers[i].status === status.WORK) {
                throw new Error(`${this._workers[i].worker.threadId}正在进行工作`)
            }
            //NOTE: 关闭线程，不是销毁
            this._workers[i].worker.unref();
            this._workers[i].status = status.SLEEP;
        }
    }
    /**
     * @method checkWorkers 用来获取空闲Worker
     * @returns {number} 如果有空闲的，返回对应下标，如果没有返回-1
     */
    checkWorkers() {
        for (let i = 0; i < this.numOfThreads; i++) {
            if (this._workers[i].status === status.SLEEP) {
                this._workers[i].worker.ref();
                return i;
            }
        }

        return -1;
    }

    /**
     * @method run 运行线程
     * @param {*} getData
     */
    async run() {
        return new Promise((resolve, reject) => {
            /**
             * @description 
             * 1. 获取空闲线程
             * 2. 创建任务内容
             * 3. 如果无空闲线程，放入到任务队列中
             * 4. 如果有空闲线程，直接运行任务
             */
            const restWorker = this.checkWorkers();
            const queueItem = {
                data: {
                    execFunc: this.runFunc,
                    options: this.options
                },
                callback: (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result)
                }
            }

            if (restWorker === -1) {
                this._queue.push(queueItem);
                return null;
            }

            this.runWorker(restWorker, queueItem);
        })
    }

    /**
     * @method runWorker 执行线程任务
     * @param {number} workerId 线程id
     * @param {*} queue 等待执行任务
     */
    runWorker(workerId, queue) {
        const worker = this._workers[workerId].worker;
        this._workers[workerId].status = status.WORK;
        const messageCallback = (result) => {
            queue.callback(null, result);
            cleanUp(status.SLEEP)
        }

        const errorCallback = (error) => {
            queue.callback(error);
            cleanUp(status.ERROR)
        }

        const cleanUp = (status) => {
            worker.removeAllListeners('message');
            worker.removeAllListeners('error');
            this._workers[workerId].status = status;

            if (!this._queue.length) {
                return null;
            }

            this.runWorker(workerId, this._queue.shift());
        }

        // 线程创建监听结果/错误回调
        worker.once('message', messageCallback);
        worker.once('error', errorCallback);
        // 向子线程传递初始data
        worker.postMessage(queue.data);
    }

    /**
     * @method setFunc 设置线程处理时，使用的函数
     * @param {Function} func
     */
    setFunc(func) {
        if (typeof func !== 'function') {
            throw new Error("线程处理任务出入的必须是一个函数对象")
        }
        this.runFunc = func.toString();

        return this;
    }

    setOptions(options = null) {
        this.options = options;

        return this;
    }
}

export default WorkerPool;