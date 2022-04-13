const type = {
    "0": "普通事件",
    "1": "学习事件",
    "2": "刷题事件",
    "3": "加急事件",
    "4": "家庭事件",
    "5": "出行事件",
    "6": "娱乐事件",
    "7": "猪哥事件",
}

const status = {
    "0": "未确认",
    "1": "进行中",
    "2": "已延期",
    "3": "已完成"
}

const sendMail = {
    "0": "不通知",
    "1": "通知"
}

/**
 * @method getTime获取标准格式时间
 * @param {Date} date 
 */
const getTime = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`
}

const handleData = (data) => {
    data.type = type[data.type.toString()];
    data.status = status[data.status.toString()];
    data.send_email = sendMail[data.send_email.toString()];
    if (Reflect.has(data, "runningList")) {
        for (let v of data.runningList) {
            v.type = type[v.type.toString()];
            v.status = status[v.status.toString()];
            v.send_email = sendMail[v.send_email.toString()];
        }
    }

    return data;
}
module.exports = {
    "daily_send_mail": [
        (address, data) => {
            const event = global.eventListener;
            data = handleData(data);
            event.emit("send_email", [address, data, "DailyCreating"]);
        }
    ]
}