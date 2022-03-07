import Model from "../../lib/model"
import ImageInsertFilter from "../../filter/file/ImageInsertFileter"
import os from "os";
var ifaces = os.networkInterfaces();
const host = 3000;
let ipConfig = "127.0.0.1";
for (var dev in ifaces) {
    ifaces[dev].forEach(function (details) {
        if (details.family == 'IPv4') {
            ipConfig = details.address
            return;
        }
    });
}
class Image extends Model {
    constructor() {
        super('local', 'image');
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
    async insert(data) {
        try {
            let filter = new ImageInsertFilter(data);
            let status = filter(data);
            if (status) {
                let url = Image.generateUrl(ipConfig, data.path);
                let sql = "insert into files(path, type, name, description, url) value(?,?,?,?,?)"
                let insertData = [
                    data.path,
                    0,
                    data.name || '',
                    data.description || '',
                    url
                ]
                let result = await this.database.usePool(this.name, sql, insertData);
                return result;
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method generateUrl 生成外链
     * @param {string} ip ip地址
     * @param {string} path 存放地址
     */
    static generateUrl(ip, path) {
        return `${ip}:${host}${path}`
    }
}

export default Image