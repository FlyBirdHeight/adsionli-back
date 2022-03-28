import send from "../../modules/email/send.js"
module.exports = {
    "send_email": (address, data) => {
        send(address, data, "DailyCreating");
    }
}