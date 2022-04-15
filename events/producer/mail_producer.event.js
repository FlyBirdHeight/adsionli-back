import CommentMailProducer from "../../modules/mq/producer/mail/comment.js"
import DailySendProducer from "../../modules/mq/producer/mail/daily_send.js"
import FileSendProducer from "../../modules/mq/producer/mail/file.js"
const ProducerList = {
    'dailyMail': DailySendProducer,
    'fileMail': FileSendProducer,
    'commentMail': CommentMailProducer
}
module.exports = {
    "mail_producer": async (producer, address, type, data) => {
        try {
            let Producer = ProducerList[producer];
            let obj = new Producer();
            let publishData = obj.setAddress(address).setTemplate(type).setData(data).handleDatatoString();
            let { routingKey, bindingKey, options } = obj.queueInfo;
            await obj.sendMessage(routingKey, bindingKey, publishData, options);
        }catch(e) {
            console.log(e);
        }
    }
}