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
        path: "tag/:id",
        handle: async (req, res) => {
            console.log(req.params.id);
            res.send({
                data: [],
                status: true
            })
        }
    },
    {
        method: "GET",
        path: "category/:id",
        handle: async (req, res) => {
            let returnData = await categoryTagService.getCategoryInfo(req.params.id);
            if (returnData.length != 0) {
                res.send({
                    data: returnData[0],
                    status: true
                })
            } else {
                res.send({
                    data: null,
                    status: false
                })
            }

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
            categoryTagService.deleteCategory(req.body.id)
            res.send({
                status: true
            })
        }
    }
]
/**
 * @method update 更新标签或文章
 */
exports.update = [
    {
        method: "PUT",
        path: "category",
        handle: async (req, res) => {
            try {
                let status = await categoryTagService.updateCategory(req.body);
                console.log(status)
                if(status) {
                    res.send({
                        status: true,
                        data: "更新成功!"
                    })
                }else {
                    res.send({
                        status: false,
                        data: "更新失败"
                    })
                }
            } catch (e) {
                console.log(e)
                res.send({
                    status: false,
                    data: e.toString
                })
            }
        }
    },
    {
        method: "PUT",
        path: "tag",
        handle: async (req, res) => {
            console.log(req.body);
            res.send({
                status: true
            })
        }
    }
]