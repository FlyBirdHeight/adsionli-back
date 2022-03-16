import TagCategoryService from "./service/tag_category.service"
let categoryTagService = new TagCategoryService();
/**
 * @method create 创建分类或标签
 */
exports.create = [
    {
        method: "POST",
        path: "tag",
        handle: async (req, res) => {

        }
    },
    {
        method: "POST",
        path: "category",
        handle: async (req, res) => {
            try {
                let status = await categoryTagService.insertCategory(req.body);
                res.send({
                    status: true
                })
            } catch (e) {
                res.status(400).send({
                    message: e.message
                })
            }
        }
    }
]
/**
 * @method getList 获取标签列表
 */
exports.get = [
    {
        method: "GET",
        path: "tagList",
        handle: async (req, res) => {
            console.log(req.originalUrl)
        }
    },
    {
        method: "GET",
        path: "categoryList",
        handle: async (req, res) => {
            try {
                let returnData = await categoryTagService.getCategoryList(req.query.page, req.query.count);
                res.send({
                    status: true,
                    data: returnData
                })
            } catch (error) {
                res.status(500).send({
                    status: false,
                    errorMessage: error.message
                })
            }
        }
    },
]

/**
 * @method getInfo 获取标签或分类详情
 */
exports.getInfo = [
    {
        method: "GET",
        path: "tag",
        handle: async (req, res) => {

        }
    },
    {
        method: "GET",
        path: "category",
        handle: async (req, res) => {

        }
    }
]
/**
 * @method delete 删除标签或文章
 */
exports.delete = [
    {
        method: "DELETE",
        path: "tag",
        handle: async (req, res) => {

        }
    },
    {
        method: "DELETE",
        path: "category",
        handle: async (req, res) => {

        }
    }
]
/**
 * @method update 更新标签或文章
 */
exports.update = {
    method: "PUT",
    handle: async (req, res) => {

    }
}