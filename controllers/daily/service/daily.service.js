import Daily from "../../../model/daily/daily";

class DailyService {
    constructor() {
        this.dailyModel = new Daily();
    }

    /**
     * @method getDailyInfo 获取月份信息
     * @param {*} data 包含有月份年份的信息
     */
    getDailyInfo(data) {
        let start = null;
        let end = null;
        if (data.py == data.ny && data.pm == data.nm) {
            const date = new Date(data.py, Number(data.pm), 0);
            start = `${data.py}-${data.pm < 10 ? `0${data.pm}` : data.pm}-01`;
            end = `${data.py}-${data.pm < 10 ? `0${data.pm}` : data.pm}-${date.getDate()}`;
        }else {
            const date = new Date(data.ny, Number(data.nm), 0);
            start = `${data.py}-${data.pm < 10 ? `0${data.pm}` : data.pm}-01`;
            end = `${data.ny}-${data.nm < 10 ? `0${data.nm}` : data.nm}-${date.getDate()}`
        }
        return this.dailyModel.find({
            where: {
                _link: 'or',
                start_time: {
                    type: 'between',
                    data: [start, end]
                },
                end_time: {
                    type: 'between',
                    data: [start, end]
                },
                _brackets: {
                    _link: "and",
                    start_time: {
                        type: "<=",
                        data: start
                    },
                    end_time: {
                        type: ">=",
                        data: end
                    }
                }
            }
        })
    }

    /**
     * @method insertDailySetting 添加日程数据
     * @param {*} form 日程数据
     */
    insertDailySetting(form){
        console.log(form)
    }
}

export default DailyService;