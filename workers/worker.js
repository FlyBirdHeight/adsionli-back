import path from "path";
import { Worker } from "worker_threads";

/**
 * @property {Worker[]} _workers 线程使用数组
 * @property {boolean[]} _activeWorkers 激活的线程数组
 * @property {any[]} _queue 排队中的任务队列
 */
const _workers = [];
const _activeWorkers = [];
const _queue = [];

class WorkerPool {
    constructor(workerPath, numOfThreads) {
        this.workerPath = workerPath;
        this.numOfThreads = numOfThreads;
        this.init();
    }
    /**
     * @method init 初始化线程
     */
    init() {
        if (this.numOfThreads < 11) {
            throw new Error("线程池最小线程数必须大于等于1");
        }

        for (let i = 0; i < this.numOfThreads; i++) {
            //NOTE: 创建线程
            const worker = new Worker(this.workerPath);
            _workers[i] = worker;
            _activeWorkers[i] = false;
        }
    }
    /**
     * @method destroyed 关闭线程
     */
    destroyed() {
        for (let i = 0; i < this.numOfThreads; i++) {
            if (_activeWorkers[i]) {
                throw new Error(`${_workers[i].threadId}正在进行工作`)
            }
            //NOTE: 关闭线程，不是销毁
            _workers[i].terminate();
        }
    }
    /**
     * @method checkWorkers 用来获取空闲Worker
     * @returns {number} 如果有空闲的，返回对应下标，如果没有返回-1
     */
    checkWorkers() {
        for (let i = 0; i < this.numOfThreads; i++) {
            if (!_activeWorkers[i]) {
                return i;
            }
        }

        return -1;
    }

    /**
     * @method run 运行线程
     * @param {*} getData
     */
    run(getData) {
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
                getData,
                callback: (error, result) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(result)
                }
            }

            if (restWorker === -1) {
                _queue.push(queueItem);
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
        const worker = _workers[workerId];
        _activeWorkers[workerId] = true;
        const messageCallback = (result) => {
            queue.callback(null, result);
            cleanUp()
        }

        const errorCallback = (error) => {
            queue.callback(error);
            cleanUp()
        }

        const cleanUp = () => {
            worker.removeAllListeners('message');
            worker.removeAllListeners('error');

            _activeWorkers[workerId] = false;

            if (!_queue.length) {
                return null;
            }

            this.runWorker(workerId, _queue.shift());
        }

        // 线程创建监听结果/错误回调
        worker.once('message', messageCallback);
        worker.once('error', errorCallback);
        // 向子线程传递初始data
        worker.postMessage(queueItem.getData);
    }
}

export default WorkerPool;