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

        }
    },
    {
        method: "GET",
        path: "categoryList",
        handle: async (req, res) => {

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