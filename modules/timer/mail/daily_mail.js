/**
 * README: 用来处理消息队列中的数据消息的，定时轮询
 */
let event = global.eventListener;
const DailyMail = [
    {
        name: "daily_mail_create",
        time: 10,
        open: true,
        callback: () => {
            console.log("create")
            if(!event){
                event = global.eventListener;
            }
            
            event.emit("daily_mail_consumer", ["create"]);
        }
    },
    {
        name: "daily_mail_ending",
        time: 20,
        open: false,
        callback: () => {
            console.log("ending")
            if(!event){
                event = global.eventListener;
            }
            event.emit("daily_mail_consumer", ["ending"])
        }
    },
    {
        name: "daily_mail_overtime",
        time: 86400,
        open: false,
        callback: () => {
            if(!event){
                event = global.eventListener;
            }
            event.emit("daily_mail_consumer", ["overtime"])
        }
    },
    {
        name: "daily_mail_countdown",
        time: 86400,
        open: false,
        callback: () => {
            if(!event){
                event = global.eventListener;
            }
            event.emit("daily_mail_consumer", ["countdown"])
        }
    },
    {
        name: "daily_mail_deadline",
        time: 86400,
        open: false,
        callback: () => {
            if(!event){
                event = global.eventListener;
            }
            event.emit("daily_mail_consumer", ["deadline"])
        }
    },
    {
        name: "daily_mail_confirm",
        time: 60,
        open: false,
        callback: () => {
            console.log("confirm")
            if(!event){
                event = global.eventListener;
            }
            event.emit("daily_mail_consumer", ["confirm"])
        }
    }
]

export default DailyMail;