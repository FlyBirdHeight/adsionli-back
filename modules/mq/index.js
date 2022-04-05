/**
 * @author adsionli
 * @class MqManager 消息队列管理
 * @description 消息队列管理类，主要用来管理消息队列的链接状态，如果链接中断之后，会自动调起重连
 * @note 这里主要记录链接状态，exchange交换机模块，exchange下不同的binding-key对应的queue，这里的exchange的map主要分为三类，fanout、direct、topic
 *       这三类下的exchange会分开保存，bindingkey这个map用来存储当前交换机下拥有的消息队列。
 * TODO: 在当前这个消息队列下的消费者可以拥有多位，但是要保证不重复处理造成脏处理的出现，不过这里要做幂等，这里先不做这么复杂，等到后期在去考虑这些，
 *       这里还是先只考虑单一消费者好了。还有死信的问题，如果说程序出错了，那么就无法返回确认了，那么就得把这些内容丢到死信中，同时死信队列需要去设置
 *       过期事件，让死掉的内容，重新分发到相关的原队列下去，这里就需要让数据携带对应的routingkey与bindkey方便进行查找，还需要设置重发次数阈值，一旦
 *       超过这个阈值，就直接放弃了，也不用再加入死信了。这里就需要主动去触发了，所以需要好好设计一下
 */
import amqlib from "amqplib";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Type = ['direct', 'fanout', 'topic', 'headers'];
class MqManager {
    constructor() {
        this.amqlib = amqlib;
        this.config = require("../../config/mq.json");
        this.connection = null;
        this.routingKey = new Map();
        this.bindingKey = new Map();
        this.typeExchange = new Map();
        this.dlxInfo = new Map();
        this.init();
        this.connect();
    }

    init() {
        for (let type of Type) {
            this.typeExchange.set(type, new Set());
        }
    }

    /**
     * @method reconnect 重连到消息队列服务器中
     */
    async reconnect() {
        try {
            if (this.connection) {
                return this;
            }
            await this.connect();
            return this;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * @method connect 创建连接
     */
    async connect() {
        try {
            this.connection = await this.amqlib.connect(this.config);
            this.registerExchange("adsionli", 'direct');
        } catch (e) {
            console.log(e.message);
            throw e;
        }
    }

    /**
     * @method closeConnect 关闭消息队列连接,主动释放
     */
    async closeConnect() {
        try {
            if (!this.connection) {
                return;
            }
            await this.connection.close();
            this.connection = null;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    /**
     * @method createChannel 创建通道连接
     */
    async createChannel() {
        try {
            if (!this.connection) {
                await this.reconnect();
            }
            let channel = await this.connection.createChannel();
            return channel;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * @method closeChannel 关闭连接通道
     * @param {Channel} channel 通道对象
     */
    async closeChannel(channel) {
        try {
            if (!channel) {
                throw new Error("channel是一个无效对象")
            }
            await channel.close();
            return this;
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    /**
     * @method handle 执行注册等任务
     * @param {Function} callback 执行的回调
     * @param {*} args 携带的参数
     */
    async handle(callback, ...args) {
        try {
            if (!this.connection) {
                await this.reconnect();
            }
            let channel = await this.createChannel();
            await callback.call(this, channel, ...args);
            await channel.close();
            return this;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }

    /**
     * @method registerExchange 注册交换机
     * @param {string} routingKey 路由名称
     * @param {string} type 交换机类型
     * @param {Object} options 可配置项,主要用来配置持久化等配置
     */
    async registerExchange(routingKey, type = 'direct', options = { durable: true }) {
        if (this.routingKey.has(routingKey)) {
            throw new Error("routingKey is exist! Please change routingKey!");
        }
        if (Type.indexOf(type) == -1) {
            throw new Errpr("Please make sure the switch type is one of direct, headers, topic or fanout!")
        }

        return await this.handle(async (channel, routingKey, type = 'direct', options = { durable: true }) => {
            await channel.assertExchange(routingKey, type, options);
            this.routingKey.set(routingKey, type);
            this.typeExchange.set(type, this.typeExchange.get(type).add(routingKey));
            this.bindingKey.set(routingKey, new Set());
        }, routingKey, type, options);
    }

    /**
     * @method registerQueue 注册消息队列
     * @param {string} bindingKey 绑定寻址名称
     * @param {Object} options 可配置项,主要用来配置持久化、最大消息长度等配置
     */
    registerQueue() {

    }

    /**
     * @method deleteQueue 主动释放消息队列
     * @param {string} bindingKey 队列寻址名称
     * @param {string} routingKey 绑定到的交换机的路由
     */
    async deleteQueue(bindingKey, routingKey = '') {
        if (!this.bindingKey.has(routingKey) || this.bindingKey.get(routingKey).indexOf(bindingKey) == -1) {
            return;
        }
        return await this.handle(async (channel, bindingKey, routingKey) => {
            let status = await channel.deleteQueue(bindingKey, {
                ifUnused: true,
                ifEmpty: true
            })
            console.log(status);
        }, bindingKey, routingKey)
    }

    /**
     * @method deleteExchange 删除交换机
     * @param {*} routingKey 路由地址
     * @param {*} deleteBinding 是否删除
     * @param {string} bindRouting 如果将该交换机下的队列不删除时，就将队列换绑到指定队列下
     */
    async deleteExchange(routingKey, deleteBinding = false, bindRouting = '') {
        if (!this.routingKey.has(routingKey)) {
            throw new Error("Exchange is not Exist! Please emit true routingKey!")
        }
        return await this.handle(async (channel, routingKey, deleteBinding, bindRouting) => {
            let cacheType = new Map(this.typeExchange);
            let cacheRouting = new Map(this.routingKey);
            let cacheBinding = new Map(this.bindingKey);
            let type = this.routingKey.get(routingKey);
            let typeExchange = this.typeExchange.get(type);
            let binding = this.bindingKey.get(routingKey);
            try {
                let isExist = await this.exchangeExist(routingKey);
                if (!isExist) {
                    return;
                }
                typeExchange.delete(routingKey);
                this.typeExchange.set(type, typeExchange);
                this.bindingKey.delete(routingKey);
                this.routingKey.delete(routingKey);
                if (!deleteBinding && binding.size !== 0) {
                    //TODO: 这里做一个并行处理，加速处理，这里实现的功能是变更绑定的exchange交换机
                    let values = binding.keys();
                    let promises = values.map(async (v) => {
                        await this.unBindQueueForExchange(channel, value, routingKey, type);
                        await this.bindQueueToExchange(channel, value, bindRouting, this.routingKey.get(bindRouting));
                    })
                    await Promise.all(promises);
                }
                await channel.deleteExchange(routingKey);
            } catch (e) {
                console.log(e);
                this.typeExchange = cacheType;
                this.routingKey = cacheRouting;
                this.bindingKey = cacheBinding;
                throw e;
            }
        }, routingKey, deleteBinding, bindRouting);
    }

    /**
     * @method unBindQueueForExchange 将一个消息队列从一个交换机上解绑
     * @param {Channel} channel 消息队列链接通道
     * @param {string} bindingKey 绑定消息队列的名称
     * @param {string} routingKey 指向交换机的路由名称
     * @param {string} type 交换机的类型
     * @description 解绑之后消息队列不会删除，但是需要重新绑定到对应的交换机上，否则就是在默认交换机下了
     */
    async unBindQueueForExchange(channel, bindingKey, routingKey, type = 'direct') {
        let isExistExchange = await this.exchangeExist(routingKey, channel);
        if (!isExistExchange) {
            return;
        }
        let isExistQueue = await this.queueExist(bindingKey, channel);
        if (!isExistQueue) {
            return;
        }
        return await channel.unbindQueue(bindingKey, routingKey, type);
    }

    /**
     * @method bindQueueToExchange 绑定队列到相应的交换机下
     * @param {Channel} channel 消息队列链接通道
     * @param {string} bindingKey 绑定消息队列的名称
     * @param {string} routingKey 指向交换机的路由名称
     * @param {string} type 交换机的类型
     */
    async bindQueueToExchange(channel, bindingKey, routingKey, type = '') {
        let isExistExchange = await this.exchangeExist(routingKey, channel);
        if (!isExistExchange) {
            return;
        }
        let isExistQueue = await this.queueExist(bindingKey, channel);
        if (!isExistQueue) {
            return;
        }
        return await channel.bindQueue(bindingKey, routingKey, type);
    }

    /**
     * @method findExchange 寻找不同类型下的交换机列表
     * @param {string} type 交换机类型
     */
    findExchange(type) {
        return this.typeExchange.get(type);
    }

    /**
     * @method findQueue 寻找在交换机下绑定的消息队列列表
     * @param {string} routingKey 交换机路由名称
     */
    findQueue(routingKey) {
        return this.routingKey.get(routingKey);
    }

    /**
     * @method exchangeExist 判断交换机是否存在
     * @param {string} routingKey 
     * @returns {boolean}
     */
    async exchangeExist(routingKey, channel) {
        try {
            let status = await channel.checkExchange(routingKey);
            console.log(status);
            return true;
        } catch (e) {
            console.log(e);
            channel = await this.createChannel();
            return false;
        }
    }

    /**
     * @method queueExist 判断消息队列是否存在
     * @param {string} bindingKey 
     * @param {Channel} channel 
     * @returns {boolean}
     */
    async queueExist(bindingKey, channel) {
        try {
            let status = await channel.checkQueue(bindingKey);
            console.log(status);
            return true;
        } catch (e) {
            console.log(e);
            channel = await this.createChannel();
            return false;
        }
    }

    /**
     * @method handleDlx 处理死信队列
     * @param {*} data 待处理数据，加入死信队列中
     * @param {string} routingKey exchange 交换机标识
     * @param {string} bindingKey 消息队列标识
     * @param {Object} options 相关配置项
     */
    handleDlx(data, routingKey, bindingKey, options = {}) {

    }

}

export default new MqManager();