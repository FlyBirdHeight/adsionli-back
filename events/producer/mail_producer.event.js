import CommentMailProducer from "../../modules/mq/producer/mail/comment.js"
import DailySendProducer from "../../modules/mq/producer/mail/daily_send.js"
import FileSendProducer from "../../modules/mq/producer/mail/file.js"
const ProducerList = {
    'dailyMail': new DailySendProducer(),
    'fileMail': new FileSendProducer(),
    'commentMail': new CommentMailProducer()
}
module.exports = {
    "mail_producer": async (producer, address, type, data) => {
        try {
            let obj = ProducerList[producer];
            let publishData = obj.setAddress(address).setTemplate(type).setData(data).handleDatatoString();
            let { routingKey, bindingKey, options } = obj.queueInfo;
            // console.log(obj);
            await obj.sendMessage(routingKey, bindingKey, publishData, options);
        } catch (e) {
            console.log("mail_producer", e);
            throw e;
        }
    }
}