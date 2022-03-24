class Event {
    constructor() {
        /**
         * @property {Map} eventList 监听列表
         */
        this.eventList = new Map();
    }

    /**
     * @method addEventListener 添加新的监听事件
     * @param {string} name 事件名称
     * @param {Function} callback 事件回调
     * @param {boolean} head 是否放在第一项执行
     * @returns {boolean}
     */
    addEventListener(name, callback, head = false) {
        if (this.eventList.has(name)) {
            if (this.eventList.get(name).length + 1 > 10) {
                this.printWarning(this.eventList.get(name).length)
            }
            let data = this.eventList.get(name);
            if (head && Array.isArray(data)) {
                data.unshift(callback);
            } else if (Array.isArray(data)) {
                data.push(callback)
            } else {
                data = head ? [callback, data] : [data, callback];
            }
            this.eventList.set(name, data);
            return true;
        }
        this.eventList.set(name, callback);

        return true;
    }

    /**
     * @method removeEventListener 移除监听事件
     * @param {string} name 事件名称 
     */
    removeEventListener(name) {
        if (!this.eventList.has(name)) {
            console.error("The listener event does not exist in the current listener factory！")
            return false;
        }
        this.eventList.delete(name);
        return true;
    }

    /**
     * @method removeAllEventListener 清除全部监听事件
     * @returns {boolean}
     */
    removeAllEventListener() {
        this.eventList.clear();
        return true;
    }

    /**
     * @method getEventCount 获取当前监听事件中的数量
     * @return {number}
     */
    getEventCount() {
        return this.eventList.size();
    }

    /**
     * @method getEventList 获取当前监听事件中的事件列表
     * @return {Array}
     */
    getEventList() {
        let list = [];
        this.eventList.forEach((v, k) => {
            list.push(k)
        })

        return list;
    }

    /**
     * @method emit 执行事件
     * @param {string} name  
     * @param {*} args 
     */
    emit(name, ...args) {
        if (!this.eventList.has(name)) {
            console.error("The current listening event is not exist!")
            return false;
        }
        let callback = this.eventList.get(name);
        if (Array.isArray(callback)) {
            for (let func of callback) {
                func.apply(null, ...args);
            }
        } else {
            callback.apply(null, ...args);
        }
    }

    /**
     * @method printWarning 当监听事件内回调函数超过10个的时候，发出警告
     * @param {number} length 
     */
    printWarning(length) {
        console.warn(`The current listening event has more than 10, which is ${length}, please ensure that the event does not exceed 10 callback function execution`)
    }

    get off(name) {
        return this.removeEventListener(name);
    }

    get on(name, callback) {
        return this.addEventListener(name, callback);
    }

    get prependListener(name, callback) {
        return this.addEventListener(name, callback, true);
    }
}

export default Event;