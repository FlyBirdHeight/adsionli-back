import exchange from "./register/exchange/index.js"
import queue from "./register/queue/index.js"

const register = async function () {
    try {
        let registerExchange = exchange.map(async v => {
            return await this.registerExchange(v.routingKey, v.type, v.options)
        })
        let exchangeRegisterStatus = await Promise.all(registerExchange);
        if (exchangeRegisterStatus.length !== exchange.length) {
            throw new Error("Exchange Register has something Worry")
        }

        let registerQueue = queue.map(async v => {
            return await this.registerQueue(v.bindingKey, v.options, v.routingKey);
        })
        let queueRegisterStatus = await Promise.all(registerQueue);

        console.log("Register Exchange and Queue success")
    } catch (e) {
        console.log(e);
    }
}

export {
    register
};