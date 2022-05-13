/**
 * README: 用来处理消息队列中的数据消息的，定时轮询
 */
let type = ['create', 'ending', 'overtime', 'countdown', 'deadline', 'confirm']
const DailyMail = [
    {
        name: "daily_mail",
        time: 20,
        open: false,
        description: "处理日程发信，统一入口处理，对所有的内容：确认，创建，状态改变，结束等内容",
        callback: () => {
            eventListener.emit("daily_mail_consumer", type);
        }
    },
]

export default DailyMail;