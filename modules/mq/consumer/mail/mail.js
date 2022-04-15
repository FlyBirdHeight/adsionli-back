/**
 * NOTE: 专门用来处理发信的消费者，用来处理mail_*主题的消息队列
 */
import Consumer from "../consumer.js"
class MailConsumer extends Consumer {
    constructor() {
        super('MailConsumer');
        this.consumerInfo = {
            bindingKey: "mail_setting_*",
            options: {
                consumerTag: this.consumer
            }
        }
    }

    /**
     * @method setBindingKey 设置bindingKey，如果这里设置了就不再是通配的了，变成了direct了
     * @param {*} bindingKey 
     */
    setBindingKey(bindingKey) {
        this.consumerInfo.bindingKey = bindingKey;

        return this;
    }
}

export default MailConsumer;