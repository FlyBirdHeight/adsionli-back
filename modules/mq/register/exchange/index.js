/**
 * @description 这里使用注册相关的交换机以及消息队列的
 */

const exchange = [
    {
        routingKey: "mail",
        type: "topic",
        options: {
            durable: true
        }
    },
    {
        routingKey: "page",
        type: "direct",
        options: {
            durable: true
        }
    },
    {
        routingKey: "daily",
        type: "direct",
        options: {
            durable: true
        }
    },
    {
        routingKey: "file",
        type: "direct",
        options: {
            durable: true
        }
    }
]

export default exchange;