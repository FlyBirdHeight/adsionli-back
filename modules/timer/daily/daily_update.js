/**
 * README: 本处主要处理日程数据的每日自动更新
 */
const DailyUpdate = [
    {
        /**
         * @description 将日程的状态从等待开始更新为开始
         */
        name: "daily_doing_update",
        time: 86400,
        open: false,
        description: "日程开启的状态更新",
        callback: () => {
            
        }
    }
]

export default DailyUpdate