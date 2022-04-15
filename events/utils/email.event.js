import send from "../../modules/email/send.js"
module.exports = {
    "send_email": async (address, data, template) => {
        try {
            await send(address, data, template);
        }catch(e) {
            console.log(e);
            throw e;
        }
    }
}