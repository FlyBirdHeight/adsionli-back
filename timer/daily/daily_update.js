/**
 * README: 本处主要处理日程数据的每日自动更新
 */
const DailyUpdate = [
    {
        /**
         * @description 将未确认日程的状态自动变为确认态
         */
        name: "daily_unconfirmed_update",
        time: 30,
        open: true,
        description: "将未确认日程的状态自动变为确认态",
        callback: () => {
            eventListener.emit("update_daily_unconfirmed_status");
        }
    },
    {
        /**
         * @description 将未开始日程的状态且符合开始条件的话变为开始态
         */
        name: "daily_not_start_update",
        time: 30,
        open: true,
        description: "将未开始日程的状态且符合开始条件的话变为开始态",
        callback: () => {
            eventListener.emit("update_daily_not_start_status");
        }
    },
    {
        /**
         * @description 监听进行中日程的状态并相应改变
         */
        name: "update_daily_running_status",
        time: 30,
        open: true,
        description: "监听进行中日程的状态并相应改变",
        callback: () => {
            eventListener.emit("update_daily_running_status");
        }
    }
]

export default DailyUpdate