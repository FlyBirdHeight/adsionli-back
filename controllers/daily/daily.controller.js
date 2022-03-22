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
 * @method create 创建日程
 */
exports.create = {
    method: "POST",
    handle: async (req, res) => {

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
 * @method getListByDay 获取日程表，通过日子
 */
exports.getListByDay = {
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

    }
}
/**
 * @method update 更新日程
 */
exports.update = {
    method: "PUT",
    handle: async (req, res) => {

    }
}
/**
 * @method ending 完成日程
 */
exports.ending = {
    method: "PUT",
    handle: async (req, res) => {

    }
}

