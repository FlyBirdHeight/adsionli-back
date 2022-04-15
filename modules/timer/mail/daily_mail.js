/**
 * README: 用来处理消息队列中的数据消息的，定时轮询
 */
const event = global.eventListener;

const handleCreate = () => {
    event.emit("daily_mail", ["create"]);
}

const handleEnding = () => {
    event.emit("daily_mail", ["ending"])
}

const handleOverTime = () => {
    event.emit("daily_mail", ["overtime"])
}

const handleCountdown = () => {
    event.emit("daily_mail", ["countdown"])
}

const handleDeadline = () => {
    event.emit("daily_mail", ["deadline"])
}

const handleConfirm = () => {
    event.emit("daily_mail", ["confirm"])
}

const DailyMail = {
    "DailyCreate": handleCreate,
    "DailyEnding": handleEnding,
    "DailyOverTime": handleOverTime,
    "DailyCountdown": handleCountdown,
    "DailyDeadline": handleDeadline,
    "DailyConfirm": handleConfirm
}

exports.dailyTimeTask = DailyMail;