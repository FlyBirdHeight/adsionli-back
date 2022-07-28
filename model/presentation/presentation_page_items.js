import Models from "../../lib/model";
import PresentationPages from "./presentation_pages";
import verifyUpdate from "../../workers/presentation/verify.mjs";
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
     * @param {[]} newData
     * @param {[]} oldData 
     */
    async isUpdate(newData, oldData) {
        let newLen = newData.length, oldLen = oldData.length;
        if (newLen != oldLen) {
            return true;
        }
        let compare = [];
        //README: 使用简单diff的思想判断节点是否发生卸载或新增的操作
        while (newData.length && oldData.length) {
            let newIdx = newData.findIndex(v => {
                return v.item_index === oldData[0].item_index
            })
            if (newIdx === -1) {
                return true;
            }
            let oldD = oldData.shift();
            let newD = newData.splice(newIdx, 1);
            compare.push({
                oldData: oldD,
                newData: newD
            })
        }
        //NOTE: 只要有一个没处理完，说明就已经发生了更新了，直接返回更新了
        if (newData.length != 0 || oldData.length != 0) {
            return true;
        }
        //NOTE: 比较config是否发生了改变
        let sliceData = this.getSliceData(compare);
        let verifyFunc = verifyUpdate;
        let status = await Promise.all(sliceData.map(async (_, index) => {
            const res = await global.threadPool.setFunc(verifyFunc).setOptions(sliceData[index]).run();
            return res;
        }))

        return status.includes(true);
    }
    /**
     * @method getSliceData 获取用于多线程比较的参数
     * @param {[]} compare 
     */
    getSliceData(compare) {
        let len = compare.length;
        let threadCount = global.threadPool.numOfThreads;
        let sliceData = [];
        let num = 0, step = 1;
        if (len < threadCount) {
            sliceData = new Array(len).fill(0).map(_ => {
                let data = compare.slice(num, num + step);
                num += step;

                return data;
            })
        } else {
            step = Math.ceil(len / threadCount);
            sliceData = new Array(len).fill(0).map((_, index) => {
                if (index === len - 1) {
                    return compare.slice(num)
                }
                let data = compare.slice(num, num + step);
                num += step;

                return data;
            })
        }

        return sliceData
    }
}

export default PresentationPageItems;