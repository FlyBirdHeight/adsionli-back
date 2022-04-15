import MailConsumer from "../../modules/mq/consumer/mail/mail.js"
import send from "../../modules/email/send.js"
let mailConsumer = new MailConsumer();
let event = global.eventListener;
/**
 * README: 注意，这里是在定时器中被触发过来的，所以这里得处理一下数据
 */
module.exports = {
    "daily_mail_consumer": async (type) => {
        mailConsumer.setQueueName("mail_setting_daily");

        await mailConsumer.consumerData(async (data, channel) => {
            try {
                if (!event) {
                    event = global.eventListener;
                }
                let publishData = JSON.parse(data.content.toString());
                if (type !== publishData.type) {
                    channel.reject(data);
                    return;
                }
                return send(publishData.address, publishData.data, publishData.template);
            } catch (e) {
                throw e;
            }
        }, mailConsumer.consumerInfo.queueName, mailConsumer.consumerInfo.options)
    },
    "file_mail_consumer": () => {

    },
    "comment_mail_consumer": () => {

    }
}