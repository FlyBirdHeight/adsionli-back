import PresentationService from "./service/presentation.service";
const presentationService = new PresentationService();

/**
 * @method get 获取个人展示页数据内容
 */
exports.get = [
    {
        method: "GET",
        path: "showList",
        handle: async (req, res) => {

        }
    },
    {
        method: "GET",
        path: "presentation",
        handle: async (req, res) => {
            try {
                let resData = await presentationService.getPresentation(req.query);
                res.send({
                    status: 'success',
                    data: resData
                })
            } catch (e) {
                res.status(500).send({
                    status: 'error',
                    message: e.message
                })
            }
        }
    }
]

/**
 * @method update 更新个人展示页内容
 */
exports.update = [
    {
        method: "GET",
        path: "verify",
        description: "判断是否发生更新",
        handle: async (req, res) => {

        }
    },
    {
        method: "PUT",
        path: "data",
        description: "更新数据",
        handle: async (req, res) => {

        }
    },
    {
        method: "PATCH",
        path: "use",
        description: "更新使用展示内容",
        handle: async (req, res) => {

        }
    }
]

/**
 * @method create 创建个人展示页
 */
exports.create = [
    {
        method: "POST",
        path: "presentation",
        description: "创建个人展示实体",
        handle: async (req, res) => {
            try {
                let status = await presentationService.createPresentation(req.body);
                res.send({
                    status: 'success'
                })
            } catch (e) {
                console.log(e)
                res.status(500).send({
                    status: "error",
                    message: `创建失败:${e.message}`
                })
            }
        }
    },
    {
        method: "POST",
        path: "showList",
        description: "创建展示集合",
        handle: async (req, res) => {
            console.log(req.body)
            res.send({
                status: 'success'
            })
        }
    }
]

/**
 * @method delete 删除展示集合
 */
exports.delete = [
    {
        method: "DELETE",
        path: "presentation",
        description: "删除个人展示实体",
        handle: async (req, res) => {

        }
    },
    {
        method: "DELETE",
        path: "showList",
        description: "删除展示集合",
        handle: async (req, res) => {

        }
    }
]