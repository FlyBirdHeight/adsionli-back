import PublishError from "../../../error/modules/mq/publish_error";

/**
 * NOTE: 这个类是所有生产者的基类，专门用来处理一些公有的方法，比如发信，转换成Buffer数据等操作
 * README: 下面会给出发信时，可携带额外参数的说明，就不用再去看文档了
 * 这些是写在options中的
 * 1. expiration: 消息过期时间，一旦到了时间，就会自动被丢弃或者放入到死信队列中，类型: string
 * 2. userId: 消息的携带者，也就是rabbitmq登录时的用户，如果不匹配当前连接的用户的话，消费者就读取不到了，类型: string
 * 3. CC: 和邮件一样，就是会将这条消息抄送到给定的消息队列中去，类型: string or array of string
 * 4. priority: 消息优先级，当然这个需要当前的消息队列也是一个优先队列才可以，类型: positive integer
 * 5. persistent: 持久化消息，就是重启后消息不会删除，但是消息队列也必须是持久化的才可以，类型: boolean
 * 上面这些参数是会在被读取的时候，发送给消费者的，下面的参数则是不会发送给消费者，但是是有用的
 * 1.mandatory(类型: boolean), 为true，如果消息没有被路由到队列(也就是说，如果没有匹配它的路由键的绑定)，该消息将被返回。false则不会
 * 2.BCC(类型: string or array of string): 隐式抄送
 * 还有一些参数不太常用，这里就不举了，可以自己去官网抗
 */
class Producer {
    constructor(producer) {
        this.mq = global.mq;
        this.producer = producer;
    }

    /**
     * @method sendMessage 向消息队列发信
     * @param {string} routingKey 交换机路由
     * @param {string} bindingKey 绑定交换机的消息队列
     * @param {string} data 传输的数据,这里需要先转成字符串，因为要写入到Buffer对象中去
     * @param {*} options 携带的参数
     * TODO: 这里是做一个强调，一定要注意，data要放入到Buffer在传递过去
     */
    async sendMessage(routingKey, bindingKey, data, options) {
        if (!this.mq.routingKey.has(routingKey)) {
            throw new PublishError("", {
                producer: this.producer,
                error: `routingKey is not Exist: ${routingKey}`
            })
        }
        if (!this.mq.bindingKey.get(routingKey).has(bindingKey)) {
            throw new PublishError("", {
                producer: this.producer,
                error: `bingingKey is not Exist: exchange:${routingKey}, queue:${bindingKey}`
            })
        }
        return await this.mq.handle(async (channel, routingKey, bindingKey, data, options) => {
            let buf = Buffer.alloc(data.length);
            buf.write(data, 'utf8');
            await channel.publish(routingKey, bindingKey, buf, options);
        }, routingKey, bindingKey, data, options)
    }
}

export default Producer