import ConsumerError from "../../../error/modules/mq/consumer_error";
/**
 * @class Consumer 消费者基类
 * README: 这里稍微对消费时可传递的参数做一个简单的说明
 * 1. consumerTag(type: string): 消费者的标签，如果不提供的话，服务会自动生成一个随机的名称并在回复中携带
 * 2. noLocal: 没啥用，可以不去设置，因为rabbitmq自己还没实现
 * 3. noAck(type: boolean): 不回复Ack确认的一个参数，如果设置为true的话，一旦消息被传送到消费者就会立刻出列；如果为false,就会等待被确认
 * 4. exclusive(type: boolean): 独占，如果为true，就只能被当前消费者占据，其他消费者在连接到消息队列时，就会立即被释放
 * 5. priority(type: integer): 处理优先级，优先级较高的使用者优先于优先级较低的使用者获取消息
 * 6. arguments(object): 额外携带参数
 */
class Consumer {
    constructor(consumer) {
        this.mq = global.mq;
        this.consumer = consumer;
    }
    /**
     * @method consumerData 消费数据
     * @param {*} fn 消费数据的执行方法
     * README: 如果是在一个topic下的exchange的话，那就可以传入一个模糊的bindingKey，这样就可以通配好几个消息队列了
     * @param {string} bindingKey 绑定消息队列的key
     * @param {*} options 额外携带参数
     */
    async consumerData(fn, bindingKey, options = {}) {
        if (typeof fn !== 'function') {
            throw new ConsumerError("", {
                consumer: this.consumer,
                error: `The callback function parameter of consumer consumption is not a function object！`
            })
        }
        return await this.mq.handle(async (channel, fn, bindingKey, options = {}) => {
            try {
                await this.queueExist(bindingKey, channel);
                await channel.consume(bindingKey, (msg) => {
                    try {
                        await fn.call(this, msg, channel);
                        channel.ack(msg)
                    } catch (e) {
                        console.log(e);
                        channel.nack(msg)
                    }
                }, options)
            } catch (e) {
                console.log(e);
                throw new ConsumerError("", {
                    consumer: this.consumer,
                    error: e
                })
            }
        }, fn, bindingKey, options);
    }
}

export default Consumer