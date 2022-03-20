import Category from "../../../model/page/category";
import Tag from "../../../model/page/tag";

class TagCategoryService {
    constructor() {
        this.categoryModel = new Category();
        this.tagModel = new Tag();
    }

    /**
     * @method getCategoryList 获取分类列表
     * @param {number} page
     * @param {number} count
     */
    async getCategoryList(page, count) {
        let data = await this.categoryModel.find({
            page: page || 1,
            count: count || 20,
            where: {
                is_delete: 0
            },
            sort: {
                name: "sort",
                type: "asc"
            }
        });
        let dataCount = await this.categoryModel.getCount({
            where: {
                is_delete: 0
            }
        })

        return {
            data,
            count: dataCount[0].count
        }
    }

    /**
     * @method insertCategory 添加分类
     * @param {*} insertData 添加分类数据
     */
    insertCategory(insertData) {
        return this.categoryModel.insert(insertData);
    }

    /**
     * @method deleteCategory 删除指定id分类
     * @param {number[]} deleteId id数组
     */
    deleteCategory(deleteId) {
        return this.categoryModel.update({
            set: {
                is_delete: 1
            },
            where: {
                id: deleteId
            }
        });
    }

    /**
     * @method getCategoryInfo 获取详细信息
     * @param {Number} id 
     */
    getCategoryInfo(id) {
        return this.categoryModel.findById(id)
    }

    /**
     * @method updateCategory 更新数据信息
     * @param {*} data
     */
    updateCategory(data) {
        Reflect.has(data, 'created_at') && Reflect.deleteProperty(data, 'created_at');
        Reflect.has(data, 'updated_at') && Reflect.deleteProperty(data, 'updated_at');
        if (!Reflect.has(data, 'id')) {
            throw new Error('id未传入')
        }
        let id = data.id;
        Reflect.deleteProperty(data, 'id');
        return this.categoryModel.update({
            set: data,
            where: {
                id: id
            }
        })
    }
}

export default TagCategoryService;