import { register } from "./register.js"
/**
 * @author adsionli
 * @class MqManager 消息队列管理
 * @description 消息队列管理类，主要用来管理消息队列的链接状态，如果链接中断之后，会自动调起重连
 * @note 这里主要记录链接状态，exchange交换机模块，exchange下不同的binding-key对应的queue，这里的exchange的map主要分为三类，fanout、direct、topic
 *       这三类下的exchange会分开保存，exchangeGroup这个map用来存储当前交换机下拥有的消息队列。
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
        this.exchangeList = new Map();
        this.exchangeGroup = new Map();
        this.typeExchange = new Map();
        this.queueList = new Set();
        this.dlxInfo = new Map();
        this.init();
        this.connect();
        register.call(this)
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
            console.log("createChannel:", e);
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
            console.log("closeChannel:", e)
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
            console.log("handleError", e);
            throw e;
        }
    }

    /**
     * @method registerExchange 注册交换机
     * @param {string} name 交换机名称
     * @param {string} type 交换机类型
     * @param {Object} options 可配置项,主要用来配置持久化等配置
     */
    async registerExchange(name, type = 'direct', options = { durable: true }) {
        if (this.exchangeList.has(name)) {
            throw new Error("Exchange Name is exist! Please change Exchange Name!");
        }
        if (Type.indexOf(type) == -1) {
            throw new Errpr("Please make sure the switch type is one of direct, headers, topic or fanout!")
        }

        return await this.handle(async (channel, name, type = 'direct', options = { durable: true }) => {
            await channel.assertExchange(name, type, options);
            this.exchangeList.set(name, type);
            this.typeExchange.set(type, this.typeExchange.get(type).add(name));
            this.exchangeGroup.set(name, new Set());
        }, name, type, options);
    }

    /**
     * @method registerQueue 注册消息队列
     * @param {string} name 消息队列名称
     * @param {Object} options 可配置项,主要用来配置持久化、最大消息长度等配置
     * @param {string} exchangeName exchange交换机的路径
     */
    async registerQueue(name, options = { durable: true }, exchangeName = '') {
        if (typeof (name) !== 'string' || name.replace(/\s/g, '') === '') {
            throw new Error("Please set a valid queue name value!")
        }
        if (exchangeName !== '') {
            if (!this.exchangeList.has(exchangeName)) {
                throw new Error("Please enter a valid exchange route！");
            }
            if (this.queueList.has(name)) {
                throw new Error("The queue name of the queue List has been existed, please reset it!");
            }
            return await this.handle(async (channel, name, options = { durable: true }, exchangeName = '') => {
                await channel.assertQueue(name, options);
                this.queueList.add(name);
                await this.bindQueueToExchange(channel, name, exchangeName, `${exchangeName == '' ? '' : `${exchangeName}/`}${name}`);
                this.exchangeGroup.get(exchangeName).add(name);
            }, name, options, exchangeName)
        } else {
            throw new Error("Set up a exchange route to bind message queues to the specified exchange!")
        }
    }

    /**
     * @method deleteQueue 主动释放消息队列
     * @param {string} queueName 队列寻址名称
     * @param {string} exchangeName 交换机名称
     */
    async deleteQueue(queueName, exchangeName = '') {
        if (!this.exchangeGroup.has(exchangeName) || this.exchangeGroup.get(exchangeName).indexOf(queueName) == -1) {
            return;
        }
        return await this.handle(async (channel, queueName, exchangeName) => {
            let status = await channel.deleteQueue(queueName, {
                ifUnused: true,
                ifEmpty: true
            });
        }, queueName, exchangeName)
    }

    /**
     * @method deleteExchange 删除交换机
     * @param {*} exchangeName 交换机名称
     * @param {*} deleteBinding 是否删除
     * @param {string} otherExchange 如果将该交换机下的队列不删除时，就将队列换绑到指定交换机下
     */
    async deleteExchange(exchangeName, deleteBinding = false, otherExchange = '') {
        if (!this.exchangeList.has(exchangeName)) {
            throw new Error("Exchange is not Exist! Please emit true exchange name!")
        }
        let fn = async (channel, exchangeName, deleteBinding, otherExchange) => {
            let cacheType = new Map(this.typeExchange);
            let cacheRouting = new Map(this.exchangeList);
            let cacheBinding = new Map(this.exchangeGroup);
            let type = this.exchangeList.get(exchangeName);
            let typeExchange = this.typeExchange.get(type);
            let binding = this.exchangeGroup.get(exchangeName);
            try {
                let isExist = await this.exchangeExist(exchangeName);
                if (!isExist) {
                    return;
                }

                if (!deleteBinding && binding.size !== 0) {
                    //TODO: 这里做一个并行处理，加速处理，这里实现的功能是变更绑定的exchange交换机
                    let unBindValue = binding.keys();
                    let bindValue = binding.keys();
                    let unBind = unBindValue.map(async (value) => {
                        return await this.unBindQueueForExchange(channel, value, exchangeName, type);
                    })
                    await Promise.all(unBind);
                    let bind = bindValue.map(async (value) => {
                        return await this.bindQueueToExchange(channel, value, otherExchange, `${otherExchange == '' ? '' : `${otherExchange}/`}${name}`);
                    })
                    await Promise.all(bind)
                }
                await channel.deleteExchange(exchangeName);
                typeExchange.delete(exchangeName);
                this.exchangeGroup.delete(exchangeName);
                this.exchangeList.delete(exchangeName);
                this.typeExchange.set(type, typeExchange);
            } catch (e) {
                console.log(e);
                this.typeExchange = cacheType;
                this.exchangeList = cacheRouting;
                this.exchangeGroup = cacheBinding;
                throw e;
            }
        }
        return await this.handle(fn, exchangeName, deleteBinding, otherExchange)
    }

    /**
     * @method unBindQueueForExchange 将一个消息队列从一个交换机上解绑
     * @param {Channel} channel 消息队列链接通道
     * @param {string} queueName 绑定消息队列的名称
     * @param {string} exchangeName 指向交换机的路由名称
     * @param {string} type 交换机的类型
     * @description 解绑之后消息队列不会删除，但是需要重新绑定到对应的交换机上，否则就是在默认交换机下了
     */
    async unBindQueueForExchange(channel, queueName, exchangeName, type = 'direct') {
        let isExistExchange = await this.exchangeExist(exchangeName, channel);
        if (!isExistExchange) {
            return;
        }
        let isExistQueue = await this.queueExist(queueName, channel);
        if (!isExistQueue) {
            return;
        }
        return await channel.unbindQueue(queueName, exchangeName, type);
    }

    /**
     * @method bindQueueToExchange 绑定队列到相应的交换机下
     * @param {Channel} channel 消息队列链接通道
     * @param {string} queueName 绑定消息队列的名称
     * @param {string} exchangeName 指向交换机的路由名称
     * @param {string} routingKey 路由
     */
    async bindQueueToExchange(channel, queueName, exchangeName, routingKey) {
        let isExistExchange = await this.exchangeExist(exchangeName, channel);
        if (!isExistExchange) {
            return;
        }
        let isExistQueue = await this.queueExist(queueName, channel);
        if (!isExistQueue) {
            return;
        }
        return await channel.bindQueue(queueName, exchangeName, routingKey);
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
     * @param {string} exchangeName 交换机路由名称
     */
    findQueue(exchangeName) {
        return this.exchangeList.get(exchangeName);
    }

    /**
     * @method exchangeExist 判断交换机是否存在
     * @param {string} exchangeName 
     * @returns {boolean}
     */
    async exchangeExist(exchangeName, channel) {
        try {
            //NOTE: 这里只要不报错，就代表存在，如果有额外参数的话，会返回
            let status = await channel.checkExchange(exchangeName);
            return true;
        } catch (e) {
            console.log(e);
            channel = await this.createChannel();
            return false;
        }
    }

    /**
     * @method queueExist 判断消息队列是否存在
     * @param {string} queueName 
     * @param {Channel} channel 
     * @returns {boolean}
     */
    async queueExist(queueName, channel) {
        try {
            //NOTE: 这里只要不报错，就代表存在，如果有额外参数的话，会返回
            let status = await channel.checkQueue(queueName);
            return true;
        } catch (e) {
            console.log("queueExist:", e);
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
let mq = new MqManager();

export default mq;