import send from "../../modules/email/send.js"
module.exports = {
    "send_email": async (address, data, template) => {
        try {
            let status = await send(address, data, template);
            console.log("邮件发送成功", status);
        }catch(e) {
            console.log(e);
            throw e;
        }
    }
}