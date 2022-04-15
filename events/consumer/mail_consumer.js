import MailConsumer from "../../modules/mq/consumer/mail/mail.js"
let mailConsumer = new MailConsumer();
/**
 * README: 注意，这里是在定时器中被触发过来的，所以这里得处理一下数据
 */
module.exports = {
    "daily_mail": async (type) => {
        mailConsumer.setBindingKey("mail_setting_daily");
        const event = global.eventListener;
        await mailConsumer.consumerData(async (data, channel) => {
            try {
                let publishData = JSON.parse(data.content.toString('utf8'));
                if(type !== publishData.type){
                    channel.reject(data);
                    return;
                }
                await event.emit("send_email", [publishData.address, publishData.data, publishData.template]);
            } catch (e) {
                throw e;
            }
        }, mailConsumer.consumerInfo.bindingKey, mailConsumer.consumerInfo.options)
    },
    "file_mail": () => {

    },
    "comment_mail": () => {

    }
}