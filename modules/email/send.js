import { createRequire } from 'module';
import config from "../../config/email.json"
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: config.service,
    port: 465,
    secureConnection: true,
    auth: {
        user: config.user,
        password: config.password
    }
})

let mailOption = (address, title, template) => {
    return {
        from: config.form,
        to: address,
        title: title,
        html: template
    }
}

