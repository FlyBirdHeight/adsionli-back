import nodemailer from "nodemailer";
import config from "../../config/email.json"
import template from "./template.js"

const templateHtml = template
/**
 * @method send 发送邮件
 * @param {string} address 邮箱地址
 * @param {*} data 发送数据
 * @param {*} template 发送模板名称
 */
const send = async (address, data, template) => {
    try {
        let transporter = nodemailer.createTransport({
            service: config.qq.service,
            secureConnection: true,
            secure: true,
            auth: {
                user: config.qq.user,
                pass: config.qq.password
            }
        })
        let mailOption = (address, title, template) => {
            return {
                from: `"adsionli" <${config.qq.user}>`,
                to: address,
                subject: title,
                html: template
            }
        }
        let content = Reflect.has(templateHtml, template) ? templateHtml[template](data) : null;
        let option = mailOption(address, content ? content.title : "默认主题", content ? content.content : "默认主题");
        return transporter.sendMail(option);
    } catch (e) {
        throw e;
    }
}

export default send;
