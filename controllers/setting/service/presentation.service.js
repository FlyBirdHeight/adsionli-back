import Service from "../../../lib/service";
import Presentations from "../../../model/presentation/presentations";
import PresentationPages from "../../../model/presentation/presentation_pages";
import PresentationPageItems from "../../../model/presentation/presentation_page_items";
/**
 * @method handlePresentationData 处理一下数据库请求数据的返回值
 * @param {*} data 
 */
const handlePresentationData = (data) => {
    if (data.presentation_page_list.length === 0) {
        return data;
    }
    data.presentation_page_list.forEach(page => {
        page.page_config = JSON.parse(page.page_config);
        page.page_item_list = JSON.parse(page.page_item_list);
        Reflect.deleteProperty(page, 'created_at');
        Reflect.deleteProperty(page, 'updated_at');
        if (page.presentation_page_items.length !== 0) {
            page.presentation_page_items.forEach(item => {
                item.config = JSON.parse(item.config);
                Reflect.deleteProperty(item, 'created_at');
                Reflect.deleteProperty(item, 'updated_at');
                if (item.type === 'text') {
                    item.data = item.value;
                } else if (item.type === 'image') {
                    item.url = item.value;
                }
                Reflect.deleteProperty(item, 'value');
            })
        }
    })

    return data;
}
class PresentationService extends Service {
    constructor() {
        super();
        this.presentationModel = new Presentations();
        this.pageModel = new PresentationPages();
        this.itemModel = new PresentationPageItems();
    }
    /**
     * @method isUpdate 判断是否发生了更新
     */
    isUpdate() {

    }

    /**
     * @method createPresentation 创建展示页内容
     * @param {[]} data 等待添加数据
     */
    async createPresentation(data) {
        if (data.length == 0) throw new Error("数据不可为空")
        let presentationSave = {
            page_count: data.length,
            presentation_page_list: [],
            name: '首页展示',
            description: "",
            is_use: true
        }
        let createPage = [];
        let itemList = new Map();
        for (let value of data) {
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
        //NOTE: 开启事务
        let connection = await this.presentationModel.startAffair(true);
        try {
            //NOTE: 新建集合
            presentationSave.presentation_page_list = JSON.stringify(presentationSave.presentation_page_list)
            let insertPresentation = await this.presentationModel.insert(presentationSave, true);
            let resultMain = await new Promise((resolve, reject) => {
                connection.query(insertPresentation.sql, insertPresentation.addData, function (error, results) {
                    if (error) {
                        reject(error)
                    }
                    resolve(results)
                })
            });
            createPage = createPage.map(v => {
                v.presentation_id = resultMain.insertId
                v.page_item_list = JSON.stringify(v.page_item_list)
                return v;
            })
            //NOTE: 新建Page页
            let insertPage = await this.pageModel.insertMore(createPage, true);

            let resultBody = await new Promise((resolve, reject) => {
                connection.query(insertPage.sql, insertPage.addData, function (error, results) {
                    if (error) {
                        reject(error)
                    }
                    resolve(results)
                })
            });

            //NOTE: 新建Item
            let startId = resultBody.insertId;
            let affectCount = resultBody.affectedRows;
            if (affectCount !== createPage.length) {
                await connection.rollback();
                throw new Error("创建失败：相关page创建不成功")
            }
            let itemData = [];
            for (let i = 0; i < affectCount; i++) {
                const pageKey = createPage[i].page_key;
                let item = itemList.get(pageKey);
                item.pageId = startId;
                Reflect.deleteProperty(item, 'page_key')
                startId++;
                itemData.push(item)
            }
            itemList = null;
            let insertData = this.itemModel.getInsertData(itemData);
            let insertItem = this.itemModel.insertMore(insertData, true);
            await connection.query(insertItem.sql, insertItem.addData);
            await connection.commit();

            return true;
        } catch (e) {
            await connection.rollback();

            throw new Error("创建失败：", e.message)
        }

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
     * @param {string} presentationName 展示页名称
     */
    async getPresentation(presentationName) {
        try {
            if (!Reflect.ownKeys(presentationName, 'name')) {
                throw new Error("请传入展示页集合名称进行获取");
            }

            let name = presentationName.name;
            let returnData = await this.presentationModel.getPresentation({
                name
            }, true)
            if (!returnData) return null;
            return handlePresentationData(returnData);
        } catch (e) {
            console.log(e)
            throw e;
        }
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