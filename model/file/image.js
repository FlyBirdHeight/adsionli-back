import Model from "../../lib/model"
class Image extends Model {
    constructor() {
        super('local');
        this.structure = {
            id: null,
            path: '',
            type: 0,
            desc: '',
            url: '',
            download_count: '',
            created_at: '',
            updated_at: ''
        }
    }

    /**
     * @method insert 添加图片文件
     * @param {*} data 等待添加数据
     */
    insert(data){
        
    }
}

export default Image