import Daily from "../../../model/daily/daily";
import Service from "../../../lib/service";
import { emit } from "nodemon";

class DailyService extends Service {
    constructor() {
        super();
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
        } else {
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
     * @method getList 普通形式获取列表
     * @param {*} data 
     */
    getList(data) {
        let page = data.page || 1;
        let count = data.count || 20;
        let sort = data.sort || {
            name: "start_time",
            type: "desc"
        }
        Reflect.has(data, 'page') && Reflect.deleteProperty(data, 'page');
        Reflect.has(data, 'count') && Reflect.deleteProperty(data, 'count');
        Reflect.has(data, 'sort') && Reflect.deleteProperty(data, 'sort');
        return this.dailyModel.find({
            page: page || 1,
            count: count || 20,
            where: data,
            sort: sort
        })
    }

    /**
     * @method insertDailySetting 添加日程数据
     * @param {*} form 日程数据
     */
    async insertDailySetting(form) {
        try {
            let status = await this.dailyModel.insert(form)
            /**
             * NOTE 添加成功后，触发监听器，发送邮件，同时获取正在进行任务
             */
            if (status.affectedRows == 1) {
                let runningList = await this.dailyModel.find({
                    where: {
                        creator: form.creator,
                        status: 1
                    },
                    page: 1,
                    count: 20,
                    sort: {
                        name: "end_time",
                        type: "asc"
                    }
                })
                if (runningList.length != 0) {
                    form['runningList'] = runningList;
                }
                if (form.send_email && form.email_address != '') {
                    this.event.emit("daily_send_mail", [form.email_address, form]);
                }

                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.log(e)
            throw e;
        }
    }

    /**
     * @method updateDaily 更新日程
     * @param {*} data
     */
    updateDaily(data) {
        let id = data.id;
        Reflect.deleteProperty(data, 'id');
        Reflect.deleteProperty(data, 'created_at');
        Reflect.deleteProperty(data, 'updated_at');
        for (let key of Reflect.ownKeys(data)) {
            if (!data[key] && data[key] != 0) {
                Reflect.deleteProperty(data, key)
            }
        }

        return this.dailyModel.update({
            set: data,
            where: {
                id
            }
        })
    }

    /**
     * @method deleteDaily 删除日程
     * @param {*} data
     */
    deleteDaily(data) {
        return this.dailyModel.delete({
            where: data
        })
    }
}

export default DailyService;