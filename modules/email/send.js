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
const send = (address, data, template) => {
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
    let content = templateHtml[template](data);
    let option = mailOption(address, content.title, content.content);
    transporter.sendMail(option, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('邮件发送成功 ID：', info);
    })
}

export default send;
