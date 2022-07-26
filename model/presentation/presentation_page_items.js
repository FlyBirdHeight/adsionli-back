import Models from "../../lib/model";
import PresentationPages from "./presentation_pages";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads"
class PresentationPageItems extends Models {
    constructor() {
        super('local', 'presentation_page_items', 'presentation_page_items', [
            'item_index', 'type', 'config', 'page_id'
        ])
        this.structure = {
            id: NaN,
            item_index: "",
            type: "",
            config: '[]',
            page_id: NaN,
            created_at: '',
            updated_at: ''
        }
        this.pageModel = new PresentationPages();
    }


    /**
     * @method isUpdate 判断当前页面是否发生了更新
     * @param {number} itemData
     */
    async isUpdate(itemData) {
        let itemData = async () => {
            let data = await this.findById(itemData.id)
            return data[0]
        };
        //NOTE: 比较config是否发生了改变
        
    }
}

export default PresentationPageItems;