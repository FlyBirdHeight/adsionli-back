module.exports = {
    "daily_send_mail": [
        (email) => {
            const event = global.eventListener;
            event.emit("send_email", email);
        }
    ]
}