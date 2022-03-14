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
    getCategoryList(page, count) {
        return this.categoryModel.find({
            page: page || 1,
            count: count || 20,
            sort: {
                name: "sort",
                type: "asc"
            }
        })
    }   

    /**
     * @method insertCategory 添加分类
     * @param {*} insertData 添加分类数据
     */
    insertCategory(insertData){
        return this.categoryModel.insert(insertData);
    }
}

export default TagCategoryService;