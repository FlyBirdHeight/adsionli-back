/**
 * NOTE: 专门用来处理发信的消费者，用来处理mail_*主题的消息队列
 */
import Consumer from "../consumer.js"
class MailConsumer extends Consumer {
    constructor() {
        super('MailConsumer');
        this.consumerInfo = {
            queueName: "mail/mail_setting_*",
            options: {
                consumerTag: this.consumer
            }
        }
    }

    /**
     * @method setQueueName 设置bindingKey，如果这里设置了就不再是通配的了，变成了direct了
     * @param {*} queueName 
     */
    setQueueName(queueName) {
        this.consumerInfo.queueName = queueName;

        return this;
    }
}

export default MailConsumer;