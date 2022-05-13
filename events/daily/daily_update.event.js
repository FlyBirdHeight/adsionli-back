import Daily from "../../model/daily/daily.js"
import { dateFormat } from "../../utils/utils.js"
const dailyModel = new Daily()
const DailyStatus = {
    UNCONFIRMED: 0,
    RUNNING: 1,
    OVERTIME: 2,
    ENDING: 3,
    NOTSTARTED: 4,
}
const DailyQueueType = {
    DEADLINE: "deadline",
    OVERTIME: "overtime",
}
const countDown = 3;
/**
 * @method getStatusData 获取状态数据
 * @param {number} status 状态值 
 * @param {string} select 查询值
 */
const getStatusData = async (status, select = "id") => {
    let dataList = await dailyModel.find({
        select,
        where: {
            status
        }
    })
    if (dataList.length == 0)
        return [];
    let changeList = dataList.map(v => {
        return v
    });

    return changeList
}
module.exports = {
    /**
     * @event update_daily_unconfirmed_status 更新未确认日程状态
     */
    "update_daily_unconfirmed_status": async () => {
        try {
            let emitData = await getStatusData(DailyStatus.UNCONFIRMED, "id, start_time");
            if (emitData.length == 0) {
                return;
            }
            const dailyTime = dateFormat("yyyy-MM-dd", new Date());
            let changeNotStart = [];
            let changeStart = [];
            for (let v of emitData) {
                let time = (new Date(v.start_time)).getTime() - new Date(dailyTime).getTime()
                if (time > 0) {
                    changeNotStart.push(v.id);
                } else {
                    changeStart.push(v.id)
                }
            }
            if (changeNotStart.length != 0) {
                await dailyModel.update({
                    set: {
                        status: 4,
                        advance_time: dailyTime
                    },
                    where: {
                        id: changeNotStart,
                    }
                })
            }
            if (changeStart.length != 0) {
                await dailyModel.update({
                    set: {
                        status: 1,
                        advance_time: dailyTime
                    },
                    where: {
                        id: changeStart
                    }
                })
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    /**
     * @event update_daily_not_start_status 更新未开始日程状态
     */
    "update_daily_not_start_status": async () => {
        try {
            let emitData = await getStatusData(DailyStatus.NOTSTARTED, "id, start_time");
            if (emitData.length == 0) {
                return;
            }
            const dailyTime = dateFormat("yyyy-MM-dd", new Date());
            const updateList = [];
            for (let v of emitData) {
                let time = (new Date(v.start_time)).getTime() - new Date(dailyTime).getTime()
                if (time == 0) {
                    updateList.push(v.id);
                }
            }
            if (updateList.length === 0) {
                return;
            }
            await dailyModel.update({
                set: {
                    status: 1
                },
                where: {
                    id: updateList
                }
            })
        } catch (e) {
            console.log("update_daily_not_start_statuse", e);
            throw e;
        }
    },
    /**
     * @event update_daily_running_status 更新进行中日程状态
     * @description 计算剩余时间，倒计时，是否逾期等
     */
    "update_daily_running_status": async () => {
        try {
            let emitData = await getStatusData(DailyStatus.RUNNING, '*');
            const dailyTime = dateFormat("yyyy-MM-dd", new Date());
            if (emitData.length == 0) {
                return;
            }
            let overTimeList = new Map();
            let deadlineList = new Map();
            //NOTE: 开始计算进行中日程的剩余时间，如果逾期了就改变状态值，如果小于倒计时时间，就发送通知右键
            for (let v of emitData) {
                let time = (new Date(v.end_time)).getTime() - new Date(dailyTime).getTime()
                if (time < 0 && v.send_email == 1) {
                    let emailData = [];
                    if (overTimeList.has(v.email_address)) {
                        emailData = overTimeList.get(v.email_address);
                    }
                    emailData.push(v);
                    overTimeList.set(v.email_address, emailData);
                    continue
                }
                let date = time / 1000 / 3600 / 24;

                if (date < countDown) {
                    let emailData = [];
                    if (deadlineList.has(v.email_address)) {
                        emailData = deadlineList.get(v.email_address);
                    }
                    emailData.push(v);
                    deadlineList.set(v.email_address, emailData);
                    continue;
                }
            }

            if (deadlineList.size != 0) {
                for (let [email, value] of deadlineList.entries()) {
                    eventListener.emit("mail_producer", ["dailyMail", email, DailyQueueType.DEADLINE, value]);
                }
            }
            if (overTimeList.size != 0) {
                for (let [email, value] of overTimeList.entries()) {
                    eventListener.emit("mail_producer", ["dailyMail", email, DailyQueueType.OVERTIME, value]);
                }
                let updateList = []
                for (let [k, v] of overTimeList.entries()) {
                    updateList.push(v.id);
                }
                await dailyModel.updateStatus({
                    type: 'overtime',
                    id: updateList
                })
            }

        } catch (e) {
            console.log("update_daily_running_status", e);
            throw e;
        }
    }
}