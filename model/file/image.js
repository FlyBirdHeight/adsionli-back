import Model from "../../lib/model"
import ImageInsertFilter from "../../filter/file/ImageInsertFileter"
import os from "os";
var ifaces = os.networkInterfaces();
const host = 3000;
let ipConfig = "127.0.0.1";
// for (var dev in ifaces) {
//     ifaces[dev].forEach(function (details) {
//         if (details.family == 'IPv4') {
//             ipConfig = details.address;
//             return;
//         }
//     });
// }
class Image extends Model {
    constructor() {
        super('local', 'images', 'files');
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
            let status = filter.verification();
            let isExist = await this.find({
                where: {
                    name: data.name,
                    path: data.path
                }
            });
            if (status && isExist.length == 0) {
                let url = Image.generateUrl(ipConfig, data.url);
                let sql = "insert into files(path, type, name, description, url, size) value(?,?,?,?,?,?)"
                let insertData = [
                    data.path,
                    0,
                    data.name || '',
                    data.description || '',
                    url,
                    data.size || 0
                ]
                let result = await this.database.usePool(this.name, sql, insertData);
                return {
                    status: result,
                    rewrite: false,
                    url
                };
            } else {
                return {
                    status: false,
                    rewrite: true,
                    url: isExist[0].url,
                    id: isExist[0].id
                }
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
        return `http://${ip}:${host}${path}`
    }
}

export default Image