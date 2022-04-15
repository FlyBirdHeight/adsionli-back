import Producer from "../produce";

const TYPE = {
    REPLY: "reply",
    TOPPING: "topping",
    SELECTED: "selected",
}
/**
 * NOTE: 生产者,评论更新时，发送相关邮件,消息队列: mail_setting_comment_notify,交换机: mail(topic)
 */
class CommentMailProducer extends Producer {
    constructor() {
        super('comment_mail');
        /**
         * @property {Object} sendInfo 发信内容
         * @property {string} sendInfo.template 使用发信模板内容
         * @property {string} sendInfo.address 收信地址
         * @property {Objet} sendInfo.data 携带参数
         * @property {string} sendInfo.data.page 文章名称
         * @property {string} sendInfo.data.replyUser 回复评论用户
         * @property {string} sendInfo.data.comment 回复的评论内容
         */
        this.sendInfo = {
            template: "",
            address: "",
            data: {
                page: "",
                replyUser: "",
                comment: "",
                type: ""
            }
        }
        this.queueInfo = {
            routingKey: "mail",
            bindingKey: "mail_setting_comment_notify",
            options: {
                userId: "adsionli",
                persistent: true,
            }
        }
    }
    /**
     * @method setData 设置数据
     * @param {*} data
     */
    setData(data) {
        try {
            this.sendInfo.data = data;
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
    /**
     * @method getTemplate 获取模板
     * @param {string} type 评论处理类型
     */
    setTemplate(type) {
        let template = '';
        this.sendInfo.type = type;
        switch (type) {
            case TYPE.REPLY:
                template = 'comment_reply'
                break;
            case TYPE.TOPPING:
                template = 'comment_setting'
                break;
            case TYPE.SELECTED:
                template = 'comment_setting'
                break;
        }
        this.sendInfo.template = template;
        return this;
    }
    /**
     * @method handleDatatoString 处理数据变成string
     */
    handleDatatoString() {
        return JSON.stringify(this.sendInfo)
    }
}

export default CommentMailProducer;