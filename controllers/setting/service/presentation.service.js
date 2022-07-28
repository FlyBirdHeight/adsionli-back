import Service from "../../../lib/service";

class PresentationService extends Service {
    constructor() {
        super();
    }
    /**
     * @method isUpdate 判断是否发生了更新
     */
    isUpdate() {

    }

    /**
     * @method createPresentation 创建展示页内容
     * @param {[]} presentationData 等待添加数据
     */
    async createPresentation(presentationData) {
        if (presentationData.length == 0) throw new Error("数据不可为空")
        let presentationSave = {
            page_count: presentationData.length,
            presentation_page_list: [],
            name: String(+new Date()),
            description: "",
            is_use: false
        }
        let createPage = [];
        let itemList = new Map();
        for (let value of presentationData) {
            createPage.push({
                page_key: value.page_key,
                page_item_list: value.page_item_list,
                page_config: JSON.stringify(value.config)
            })
            presentationSave.presentation_page_list.push(value.page_key)
            itemList.set(value.page_key, {
                page_key: value.page_key,
                item: value.item
            })
        }
        presentationSave.page_count = presentationSave.presentation_page_list.length;

    }

    /**
     * @method createShowList 创建展示页分类
     */
    createShowList() {

    }

    /**
     * @method getShowList 获取展示页分类
     */
    getShowList() {

    }

    /**
     * @method getPresentation 获取展示页内容
     */
    getPresentation() {

    }

    /**
     * @method updatePresentation 更新展示页内容
     */
    updatePresentation() {

    }

    /**
     * @method updateShowList 更新展示页分类
     */
    updateShowList() {

    }

    /**
     * @method deletePresentatin 删除展示页内容
     */
    deletePresentation() {

    }

    /**
     * @method deleteShowList 删除展示页分类
     */
    deleteShowList() {

    }
}

export default PresentationService;