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
class MqManager {
    constructor() {
        this.amqlib = amqlib;
        this.connection = null;
        this.routingKey = new Map();
        this.bindingKey = new Map();
        this.dlxInfo = new Map();
    }

    /**
     * @method reconnect 重连到消息队列服务器中
     */
    reconnect() {

    }

    /**
     * @method init 初始化状态
     */
    async init() {    
        this.connection = await this.amqlib.connect("");
    }

    /**
     * @method registerExchange 注册交换机
     * @param {string} routingKey 路由名称
     * @param {string} type 交换机类型
     * @param {Object} options 可配置项,主要用来配置持久化等配置
     */
    registerExchange(routingKey, type, options = { durable: true }) {

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
    deleteQueue(bindingKey, routingKey = '') {
        if (routingKey != '') {

        } else {

        }
    }

    /**
     * @method deleteExchange 删除交换机
     * @param {*} routingKey 路由地址
     * @param {*} deleteBinding 是否删除
     */
    deleteExchange(routingKey, deleteBinding = false) {

    }

    /**
     * @method unBindQueueForExchange 将一个消息队列从一个交换机上解绑
     * @param {string} bindingKey 绑定消息队列的名称
     * @param {string} routingKey 指向交换机的路由名称
     * @param {string} type 交换机的类型
     * @description 解绑之后消息队列不会删除，但是需要重新绑定到对应的交换机上，否则就是在默认交换机下了
     */
    unBindQueueForExchange(bindingKey, routingKey, type = 'direct') {

    }

    /**
     * @method bindQueueToExchange 绑定队列到相应的交换机下
     * @param {string} bindingKey 绑定消息队列的名称
     * @param {string} routingKey 指向交换机的路由名称
     * @param {string} type 交换机的类型
     */
    bindQueueToExchange(bindingKey, routingKey, type = '') {

    }

    /**
     * @method findExchange 寻找交换机
     * @param {string} routingKey 交换机路由
     */
    findExchange(routingKey){

    }

    /**
     * @method findQueue 寻找在交换机下绑定的消息队列
     * @param {string} bindingKey 队列寻址名称
     */
    findQueue(bindingKey) {

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

export default MqManager;