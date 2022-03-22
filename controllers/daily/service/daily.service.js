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
        const date = new Date(data.year, Number(data.month), 0);
        let start = `${data.year}-${data.month < 10 ? `0${data.month}` : data.month}-01`;
        let end = `${data.year}-${data.month < 10 ? `0${data.month}` : data.month}-${date.getDate()}`;
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
}

export default DailyService;