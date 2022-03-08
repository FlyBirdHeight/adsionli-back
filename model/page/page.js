import Models from "../../lib/model";
import PageInsertFilter from "../../filter/page/PageInsertFilter";

class Page extends Models {
    constructor() {
        super('local', 'pages', 'pages')
        this.structure = {
            id: null,
            title: '',
            sub_title: '',
            head_image: '',
            description: '',
            body: '',
            tags: [],
            category: '',
            created_at: '',
            updated_at: ''
        }
    }

    /**
     * @method insert 添加文件
     * @param {*} data 等待添加文章数据
     */
    async insert(data) {
        try {
            let filter = new PageInsertFilter(data);
            let status = filter(data);
            if (status) {
                let sql = "insert into pages(title, sub_title, head_image, description, body) value(?,?,?,?,?)"
                let insertData = [
                    data.title,
                    data.sub_title,
                    data.head_image || '',
                    data.description || '',
                    data.body
                ]
                let result = await this.database.usePool(this.name, sql, insertData);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }
}

export default Page;