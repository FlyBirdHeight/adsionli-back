/**
 * NOTE: 生产者，生成文件处理的发信，所处的消息队列：mail_setting_file，所处的交换机: mail(topic)
 */
import Producer from "../produce";
const TYPE = {
    CREATE: "create",
    DELETE: "delete",
    USING: "using",
}
class FileSendProducer extends Producer {
    constructor() {
        super("fileSend");
        /**
         * @property {Object} sendInfo 发信内容
         * @property {string} sendInfo.template 使用发信模板内容
         * @property {string} sendInfo.address 收信地址
         * @property {Objet} sendInfo.data 携带参数
         * @property {string} sendInfo.event 处理这个生产者的监听器
         */
        this.sendInfo = {
            template: "",
            address: "",
            data: null,
            type: ""
        }
        this.queueInfo = {
            routingKey: "mail",
            bindingKey: "mail_setting_file",
            options: {
                userId: "adsionli",
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
    }
    /**
     * @method getTemplate 获取模板
     * @param {string} type 文件处理类型
     */
    setTemplate(type) {
        let template = '';
        switch (type) {
            case TYPE.CREATE:
                template = 'file_setting'
                break;
            case TYPE.DELETE:
                template = 'file_setting'
                break;
            case TYPE.USING:
                template = 'file_using'
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

export default FileSendProducer;