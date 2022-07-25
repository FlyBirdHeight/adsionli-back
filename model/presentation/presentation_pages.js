import Models from "../../lib/model";
import PresentationPageItems from "./presentation_page_items";

class PresentationPages extends Models {
    constructor() {
        super('local', 'presentation_pages', 'presentation_pages', [
            'page_key', 'page_config', 'page_item_list', 'presentation_id'
        ])
        this.structure = {
            id: NaN,
            page_key: "",
            page_config: "",
            page_item_list: '[]',
            presentation_id: NaN,
            created_at: '',
            updated_at: ''
        }

        this.itemModel = new PresentationPageItems();
    }

    hasManyItems() {
        return this.hasMany('presentation_page_items', 'id', 'page_id');
    }
    /**
     * @method isUpdate 判断是否发生了更新
     * @param {*} pageData 
     */
    async isUpdate(pageData) {
        //NOTE: 需要判断page本身的config是否发生了修改，还有其下的控件内容
        let pageData = await this.with('hasManyItems').findById(pageData.id);
        let update = false;
        if (pageData.presentation_page_items.length != 0) {
            for (let items of pageData.presentation_page_items) {

            }
        }
    }
    /**
     * @method getPageById 获取页面数据通过id
     * @param {*} id 
     */
    getPage(id) {
        let where = { id };
        return this.with('hasManyItems').find({
            where
        })
    }
    /**
     * @method getPageByKey 根据page的标识进行获取
     * @param {string | string[]} key 
     */
    getPageByKey(key) {
        if (Array.isArray(key)) {
            if (!key.length) {
                return [];
            }
        }

        return this.with('hasManyItems').find({
            select: "*",
            where: {
                page_key: key
            }
        })
    }
}

export default PresentationPages;