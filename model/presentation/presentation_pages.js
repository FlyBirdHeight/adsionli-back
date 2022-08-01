import Models from "../../lib/model";
import PresentationPageItems from "./presentation_page_items";
import verifyUpdate from "../../workers/presentation/verify.js";
class PresentationPages extends Models {
    constructor() {
        super('local', 'presentationPages', 'presentation_pages', [
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
     * @param {[]} oldData
     * @param {[]} newData 
     */
    async isUpdate(oldData, newData) {
        //NOTE: 首先需要判断两个数据的pageKey是否相同，不相同说明已经更新了不需要处理了, 如果移动了，也直接进行返回，说明更新了
        while (newData.length && oldData.length) {
            let newIdx = newData.findIndex(v => {
                return v.page_key === oldData[0].page_key
            })
            if (newIdx === -1) {
                return true;
            }
            let oldD = oldData.shift();
            let newD = newData.splice(newIdx, 1);

            if(verifyUpdate(newD.page_config, oldD.page_config)) {
                return true;
            }
        }
        //NOTE: 只要有一个没处理完，说明就已经发生了更新了，直接返回更新了
        if (newData.length != 0 || oldData.length != 0) {
            return true;
        }
        //NOTE: 需要判断page本身的config是否发生了修改，还有其下的控件内容
        await Promise.all()

        return false;
    }
    /**
     * @method getPageById 获取页面数据通过id
     * @param {*} id 
     */
    getPage(id) {
        let where = { id };
        return this.with(['hasManyItems']).find({
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

        return this.with(['hasManyItems']).find({
            select: "*",
            where: {
                page_key: key
            }
        })
    }
}

export default PresentationPages;