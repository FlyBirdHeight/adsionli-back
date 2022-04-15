/**
 * @description 这里使用注册相关的交换机以及消息队列的
 */

const exchange = [
    {
        name: "mail",
        type: "direct",
        options: {
            durable: true
        }
    },
    {
        name: "page",
        type: "direct",
        options: {
            durable: true
        }
    },
    {
        name: "daily",
        type: "direct",
        options: {
            durable: true
        }
    },
    {
        name: "file",
        type: "direct",
        options: {
            durable: true
        }
    }
]

export default exchange;