import QuestionService from "./service/question.service.js"
const questionService = new QuestionService();
/**
 * @method create 创建问题
 * @route /api/page/question/create
 */
exports.create = {
    method: "POST",
    handle: async (req, res) => {
        try {
            let requestData = req.body;
            await questionService.createQuestion(requestData);
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
 * @method update 更新问题
 * @route /api/page/question/update
 */
exports.update = {
    method: "PUT",
    handle: async (req, res) => {
        try {
            let requestData = req.body;
            await questionService.updateQuestion(requestData);
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
 * @method delete 删除问题
 * @route /api/page/question/delete
 */
exports.delete = {
    method: "DELETE",
    handle: async (req, res) => {
        try {
            let requestData = req.body;
            await questionService.deleteQuestion(requestData);
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