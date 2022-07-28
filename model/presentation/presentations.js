import Models from "../../lib/model";
import PresentationPages from "./presentation_pages";

class Presentations extends Models {
    constructor() {
        super('local', 'presentations', 'presentations', [
            'name', 'description', 'is_use', 'page_count', 'presentation_page_list'
        ])
        this.structure = {
            id: NaN,
            name: "",
            description: "",
            is_use: false,
            presentation_page_list: '[]',
            page_count: 1,
            created_at: '',
            updated_at: ''
        }
        this.pageModel = new PresentationPages();
    }

    hasManyPages() {
        return this.hasMany('presentation_pages', 'id', 'presentation_id');
    }

    /**
     * @method isUpdate 判断当前页面是否发生了更新
     * @param {[]} pageData
     * @param {number} id
     */
    async isUpdate(pageData, id) {
        let presentationData = await (async (id) => {
            let data = await this.findById(id);

            return data[0];
        })(id)
        let pageList = presentationData.presentation_page_list;
        let oldPage = this.pageModel.find({
            select: "id, page_item_list, page_config",
            where: {
                page_key: pageList
            }
        })
        if(oldPage.length !== pageData.length) {
            return true;
        }
        let update = await this.pageModel.isUpdate(oldPage, pageData);

        return update;
    }

    /**
     * @method getPresentationById 获取展示页通过id
     * @param {number} id
     */
    async getPresentationById(id, withItem = false) {
        let where = { id };
        if (!withItem) {
            let data = await this.with('hasManyPages').find({
                where
            })

            return data[0] || null;
        } else {
            let presentationData = await this.find({ where });
            if (presentationData.length === 0) {
                return null;
            }
            presentationData = presentationData[0];
            let pageList = presentationData[0].presentation_page_list;
            let pageData = await this.pageModel.getPageByKey(pageList);
            presentationData.presentation_page_list = presentationData.presentation_page_list.map(pageKey => {
                let index = pageData.findIndex(page => page.page_key === pageKey);
                if (index == -1) {
                    return null;
                }
                let page = pageData[index];
                return page;
            })

            return presentationData;
        }

    }
}

export default Presentations;