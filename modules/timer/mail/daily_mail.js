/**
 * README: 用来处理消息队列中的数据消息的，定时轮询
 */
const DailyMail = [
    {
        name: "daily_mail_create",
        time: 20,
        open: true,
        description: "用户创建日程时，触发的消息队列的消费",
        callback: () => {
            eventListener.emit("daily_mail_consumer", ["create"]);
        }
    },
    {
        name: "daily_mail_ending",
        time: 20,
        open: false,
        description: "用户完成日程时，触发的消息队列的消费",
        callback: () => {
            eventListener.emit("daily_mail_consumer", ["ending"])
        }
    },
    {
        name: "daily_mail_overtime",
        time: 86400,
        open: false,
        description: "用户日程超过时间时，触发的消息队列的消费",
        callback: () => {
            eventListener.emit("daily_mail_consumer", ["overtime"])
        }
    },
    {
        name: "daily_mail_countdown",
        time: 86400,
        open: false,
        description: "用户日程每日开始倒计，消息队列的消费，这里一般认为还有最后3天才触发",
        callback: () => {
            eventListener.emit("daily_mail_consumer", ["countdown"])
        }
    },
    {
        name: "daily_mail_deadline",
        time: 86400,
        open: false,
        description: "用户日程结束时间倒计时，消息队列的消费，这里一般认为还有最后3天才触发",
        callback: () => {
            eventListener.emit("daily_mail_consumer", ["deadline"])
        }
    },
    {
        name: "daily_mail_confirm",
        time: 60,
        open: false,
        description: "用户确认完成时，消息队列的消费",
        callback: () => {
            eventListener.emit("daily_mail_consumer", ["confirm"])
        }
    }
]

export default DailyMail;