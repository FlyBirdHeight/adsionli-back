import LearningService from "./service/learning_card.service.js"
const learningServe = new LearningService()
/**
 * @method create 创建闪卡
 * @route /api/page/learning_card/create
 */
exports.create = {
    method: "POST",
    handle: async (req, res) => {
        try {
            let requestData = req.body;
            let status = await learningServe.createCard(requestData);
            res.send({
                status: true
            })
        } catch (e) {
            console.log(e);
            res.status(500).send({
                message: e.message
            })
        }
    }
}
/**
 * @method edit 修改闪卡
 * @route /api/page/learning_card/edit
 */
exports.edit = {
    method: "PUT",
    handle: async (req, res) => {
        let requestData = req.body;
        let status = await learningServe.createCard(req.body);
        try {
            res.send({
                status: true
            })
        } catch (e) {
            res.status(500).send({
                message: e.message
            })
        }
    }
}
/**
 * @method delete 删除闪卡
 * @route /api/page/learning_card/delete
 */
exports.delete = {
    method: "DELETE",
    handle: async (req, res) => {
        let requestData = req.body.id;
        try {
            let status = await learningServe.deleteData(requestData);
            res.send({
                status: true,
            })
        } catch (e) {
            res.status(500).send({
                message: e.message
            })
        }
    }
}
/**
 * @method get 获取闪卡相关信息
 * @route /api/page/learning_card/get
 */
exports.get = [
    /**
     * @description 获取闪卡详情
     * @route /api/page/learning_card/get/info
     */
    {
        method: "GET",
        path: "info",
        handle: async (req, res) => {
            let requestData = req.param.id;
            let resData = await learningServe.getData('info', { id: requestData });
            try {
                res.send({
                    status: true,
                    data: resData
                })
            } catch (e) {
                res.status(500).send({
                    message: e.message
                })
            }
        }
    },
    /**
     * @description 获取闪卡列表
     * @route /api/page/learning_card/get/list
     */
    {
        method: "POST",
        path: "list",
        handle: async (req, res) => {
            let requestData = req.body;
            try {
                let resData = await learningServe.getData('list', requestData);
                res.send({
                    status: true,
                    data: resData.data,
                    total: resData.total
                })
            } catch (e) {
                res.status(500).send({
                    message: e.message
                })
            }
        }
    }
]