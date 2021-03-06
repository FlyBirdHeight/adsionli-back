import exchange from "./register/exchange/index.js"
import queue from "./register/queue/index.js"

const register = async function () {
    try {
        let registerExchange = exchange.map(async v => {
            return await this.registerExchange(v.name, v.type, v.options)
        })
        let exchangeRegisterStatus = await Promise.all(registerExchange);
        if (exchangeRegisterStatus.length !== exchange.length) {
            throw new Error("Exchange Register has something Worry")
        }

        let registerQueue = queue.map(async v => {
            return await this.registerQueue(v.queueName, v.options, v.exchangeName);
        })
        let queueRegisterStatus = await Promise.all(registerQueue);
        console.log("queue register success");
    } catch (e) {
        console.log(e);
    }
}


export {
    register
};