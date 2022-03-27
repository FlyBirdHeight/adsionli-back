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
     * @param {Function} callback 待移除事件
     */
    removeEventListener(name, callback) {
        if (!this.eventList.has(name)) {
            console.error("The listener event does not exist in the current listener factory！")
            return false;
        }
        let list = this.eventList.get(name);
        if (!list) {
            return this;
        }
        if (typeof list == 'function' && list.toString() === callback.toString()) {
            list = null;
        } else {
            let idx = -1;
            for (let i = 0; i < list.length; i++) {
                if (list[i].toString() === callback.toString()) {
                    idx = i;
                    break;
                }
            }
            if (idx === -1) {
                return this;
            }
            list.splice(i, 1);
            list = list.length === 1 ? list[0] : list;
        }
        this.eventList.set(name, list);

        return this;
    }

    /**
     * @method removeAllEventListener 清除全部监听事件
     * @param {string} name 事件名称
     * @returns {Event}
     */
    removeAllEventListener(name) {
        this.eventList.delete(name);
        return this;
    }

    /**
     * @method getEventListenerCount 获取事件下的监听者个数
     * @param {*} name 事件名称
     */
    getEventListenerCount(name) {
        if (!this.eventList.has(name)) {
            return 0;
        }
        let data = this.eventList.get(name);
        if (Array.isArray(data)) {
            return data.length;
        }
        return 1;
    }

    /**
     * @method getEventCount 获取当前监听事件中的数量
     * @return {number}
     */
    getEventCount() {
        return this.eventList.size;
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
}
/**
 * @method onceWrapper 用来处理once添加的事件执行一次，执行一次之后就将事件从监听工厂中抹除掉(先删除在执行)
 * @param  {...any} args 
 */
function onceWrapper(...args) {
    //判断是否执行过
    if (!this.field) {
        this.target.removeEventListener(this.type, this.listener);
        this.field = true;
        return Reflect.apply(this.listener, this.target, args);
    }
}
/**
 * @method _onceWrapper 返回一个回调函数，用来执行once事件
 * @param {*} target 
 * @param {*} type 
 * @param {*} listener 
 */
function _onceWrapper(target, type, listener) {
    let state = { field: false, wrapFn: null, target, type, listener };
    let wrapped = onceWrapper.bind(state);
    wrapped.listener = listener;
    state.wrapFn = wrapped;
    return wrapped;
}
Event.prototype.once = function (type, listener) {
    this.addEventListener(type, _onceWrapper(this, type, listener));
    return this;
}

Event.prototype.on = Event.prototype.addEventListener;
Event.prototype.off = Event.prototype.removeEventListener;
Event.prototype.prependListener = function (name, callback) {
    return this.addEventListener(name, callback, true);
}

export default Event;