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
        console.log(start, end);
        // return this.dailyModel.find({
        //     where: {

        //     }
        // })
    }
}

export default DailyService;