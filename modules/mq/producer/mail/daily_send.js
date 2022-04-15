/**
 * NOTE: 生产者，专门处理日程设置的发信处理，对应的消息队列：mail_setting_daily，所处的交换机：mail(topic)
 */
import Producer from "../produce";
const TYPE = {
    CREATE: "create",
    ENDING: "ending",
    OVERTIME: "overtime",
    COUNTDOWN: "countdown",
    DEADLINE: "deadline",
    CONFIRM: "confirm"
}
class DailySendProducer extends Producer {
    constructor() {
        super("dailySend");
        /**
         * @property {Object} sendInfo 发信内容
         * @property {string} sendInfo.template 使用发信模板内容
         * @property {string} sendInfo.address 收信地址
         * @property {Objet} sendInfo.data 携带参数
         */
        this.sendInfo = {
            template: "",
            address: "",
            data: null,
            type: ""
        }
        this.queueInfo = {
            routingKey: "mail",
            bindingKey: "mail_setting_daily",
            options: {
                persistent: true,
            }
        }
    }
    /**
     * @method setData 设置额外数据
     * @param {*} data
     */
    setData(data) {
        this.sendInfo.data = data;
        return this;
    }
    /**
     * @method getTemplate 获取模板
     * @param {string} type 日程处理类型
     */
    setTemplate(type) {
        let template = '';
        switch (type) {
            case TYPE.CREATE:
                this.sendInfo.event = "daily_send_mail"
                template = 'DailyCreating'
                break;
            case TYPE.ENDING:
                template = 'DailyEnding'
                break;
            case TYPE.OVERTIME:
                template = 'DailyOverTime'
                break;
            case TYPE.COUNTDOWN:
                template = 'DailyCountdown'
                break;
            case TYPE.ENDING:
                template = 'DailyEnding'
                break;
            case TYPE.DEADLINE:
                template = 'DailyDeadline'
                break;
            case TYPE.CONFIRM:
                template = 'DailyConfirm'
                break;
        }
        this.sendInfo.type = type;
        this.sendInfo.template = template;
        return this;
    }

    /**
     * @method setAddress 设置发信地址
     * @param {*} address 
     */
    setAddress(address) {
        this.sendInfo.address = address;
        return this;
    }

    /**
     * @method handleDatatoString 处理数据变成string
     */
    handleDatatoString() {
        return JSON.stringify(this.sendInfo)
    }
}

export default DailySendProducer;