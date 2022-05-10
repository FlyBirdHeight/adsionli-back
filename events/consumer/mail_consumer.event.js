import MailConsumer from "../../modules/mq/consumer/mail/mail.js"
import send from "../../modules/email/send.js"
let event = global.eventListener;
/**
 * README: 注意，这里是在定时器中被触发过来的，所以这里得处理一下数据
 */
module.exports = {
    "daily_mail_consumer": async (type) => {
        try {
            let mailConsumer = new MailConsumer(`MailConsumer_${type}`);
            mailConsumer.setQueueName("mail_setting_daily");

            await mailConsumer.consumerData(async (data, channel) => {
                try {
                    if (!event) {
                        event = global.eventListener;
                    }
                    let publishData = JSON.parse(data.content.toString());
                    if (type !== publishData.type) {
                        return false;
                    }
                    await send(publishData.address, publishData.data, publishData.template);
                    return true;
                } catch (e) {
                    return false;
                }
            }, mailConsumer.consumerInfo.queueName, mailConsumer.consumerInfo.options)
        } catch (e) {
            console.log("daily_mail_consumer_outer:", e);
        }
    },
    "file_mail_consumer": () => {

    },
    "comment_mail_consumer": () => {

    }
}