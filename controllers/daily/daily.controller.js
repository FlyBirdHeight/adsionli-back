import DailyService from "./service/daily.service"
const dailyService = new DailyService();
/**
 * @method get 获取日程列表
 */
exports.get = {
    method: "GET",
    handle: async (req, res) => {
        try {
            let data = await dailyService.getDailyInfo(req.query);
            res.send({
                status: true,
                data: data
            })
        } catch (e) {
            res.send({
                status: false,
                data: e.toString ? e.toString : e.message
            })
        }

    }
}
/**
 * @method statusList 获取日程表，通过日子
 */
exports.statusList = {
    method: "GET",
    handle: async (req, res) => {
        try {
            let returnData = await dailyService.getList(req.query);
            res.send({
                status: true,
                data: returnData
            })
        } catch (e) {
            res.send({
                status: false,
                data: e.message
            })
        }
    }
}
/**
 * @method create 创建日程
 */
exports.create = {
    method: "POST",
    handle: async (req, res) => {
        try {
            let status = await dailyService.insertDailySetting(req.body);
            if (status) {
                res.send({
                    status: true
                })
            } else {
                res.send({
                    status: false,
                    data: "something is worry!"
                })
            }
        } catch (e) {
            res.send({
                status: false,
                data: e.toString ? e.toString : e.message
            })
        }
    }
}
/**
 * @method createLearning 创建学习日程
 */
exports.createLearning = {
    method: "POST",
    handle: async (req, res) => {

    }
}
/**
 * @method createLeetCode 创建刷题日程
 */
exports.createLeetCode = {
    method: "POST",
    handle: async (req, res) => {

    }
}
/**
 * @method download 下载日程表，返回excel
 */
exports.download = {
    method: "POST",
    handle: async (req, res) => {

    }
}

/**
 * @method delete 删除日程
 */
exports.delete = {
    method: "DELETE",
    handle: async (req, res) => {
        try {
            await dailyService.deleteDaily(req.body);
            res.send({
                status: true
            })
        } catch (e) {
            res.send({
                status: false,
                data: e.toString ? e.toString : e.message
            })
        }
    }
}
/**
 * @method update 更新日程
 */
exports.update = {
    method: "PUT",
    handle: async (req, res) => {
        try {
            let status = await dailyService.updateDaily(req.body);
            res.send({
                status: true
            })
        } catch (e) {
            console.log(e);
            res.send({
                status: false,
                data: e.message
            })
        }
    }
}


