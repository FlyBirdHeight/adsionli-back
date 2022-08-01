import Models from "../../lib/model";
import verifyUpdate from "../../workers/presentation/verify.js";
class PresentationPageItems extends Models {
    constructor() {
        super('local', 'presentationPageItems', 'presentation_page_items', [
            'item_index', 'type', 'config', 'page_id', 'value'
        ])
        this.structure = {
            id: NaN,
            item_index: "",
            type: "",
            config: '[]',
            page_id: NaN,
            created_at: '',
            updated_at: '',
            value: ''
        }
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

    /**
     * @method getInsertData 处理一下需要新增的item的数据
     * @param {[]} itemList
     */
    getInsertData(itemList) {
        let returnData = [];
        for (let value of itemList) {
            if (value.item.length == 0) {
                continue;
            }
            value.item.forEach(item => {
                returnData.push({
                    page_id: value.pageId,
                    type: item.type,
                    item_index: item.index,
                    value: this.getValue(item, item.type),
                    config: JSON.stringify(item.style)
                })
            })
        }

        return returnData;
    }

    getValue(value, type) {
        switch (type) {
            case 'text':
                return value.data;
            case 'image':
                return value.url;
            default:
                return '';
        }
    }
}

export default PresentationPageItems;