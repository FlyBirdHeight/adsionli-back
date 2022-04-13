import send from "../../modules/email/send.js"
module.exports = {
    "send_email": (address, data, template) => {
        send(address, data, template);
    }
}