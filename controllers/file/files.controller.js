import fs from "fs";
import readline from "readline";
import iconv from "iconv-lite"
import FileService from "./service/file.service.js"
const fileService = new FileService();
var returnData = [];
String.prototype.toBytes = function (encoding) {
    var buff = Buffer.from(this, encoding);

    return buff;
}
/**
 * @method readFile 上传图片文件
 */
exports.readFile = {
    method: "GET",
    handle: async (req, res) => {
        try {
            const file = fs.createReadStream('/Users/adsionli/Desktop/201809032000.000', {
                encoding: 'utf-8'
            });
            file.setEncoding('utf-8')
            const out = fs.createWriteStream('/Users/adsionli/Desktop/123.txt');
            const rl = readline.createInterface({
                input: file,
                output: out
            })
            let index = 0;
            let length = 0;
            rl.on('line', (line) => {
                if (index == 0) {
                    let head = [];
                    let bl = 0;
                    line.split(' ').filter(v => v != '').forEach(v => {
                        let buf = new Buffer(v, 'utf-8');
                        if (bl + buf.length > 360) {
                            let handleData = buf.slice(buf.length + bl - 360);
                            for (let i = 0; i < handleData.length; i += 8) {

                                console.log(handleData.slice(i, i + 8).readFloatLE(0))
                            }
                        } else {
                            bl += buf.length
                        }
                    })
                } else {
                    var test = line.toBytes('utf-8')
                    length += test.length;
                    // for (let i = 0; i < test.length; i += 8) {
                    //     // console.log(test.slice(i, i + 8).readFloatLE(0))
                    // }
                }
                index++;
                console.log(length);
            })

            res.send({
                data: returnData
            })
        } catch (e) {
            console.log(e)
            res.send(e)
        }
    }
}


exports.getList = {
    method: "GET",
    handle: async (req, res) => {
        if (!Reflect.has(req.query, 'id')) {
            res.status(500).send({
                status: false,
                message: "必须传入文件夹id"
            })
        }
        let first = Reflect.has(req.query, 'first') ? Boolean(Number(req.query.first)) : false;
        let data = await fileService.getDirectoryInfo(Number(req.query.id), first);
        res.send({
            status: true,
            data: data
        })
    }
}

exports.get = [
    {
        method: "POST",
        path: "info",
        handle: async (req, res) => {
            try {
                let resData = await fileService.getInfo(req.body);
                res.send({
                    status: true,
                    data: resData
                })
            } catch (e) {
                res.status(500).send({
                    status: false,
                    data: e.toString || e.message
                })
            }
        }
    },
    {
        method: "GET",
        path: "infoById",
        handle: async (req, res) => {
            try {
                let resData = await fileService.getById(req.query.id);
                
                if (resData.length == 0) {
                    res.send({
                        status: true,
                        data: null
                    })
                } else {
                    res.send({
                        status: true,
                        data: resData[0]
                    })
                }
            } catch (e) {
                res.status(500).send({
                    status: false,
                    data: e.toString || e.message
                })
            }
        }
    }
]

exports.create = {
    method: "POST",
    path: "directory",
    handle: async (req, res) => {
        console.log(req.body);
        res.send({
            status: true,
            data: true
        })
    }
}

exports.update = [
    {
        method: "PUT",
        description: "文件目录重命名",
        path: "rename",
        handle: async (req, res) => {
            try {
                let status = await fileService.renameDirectory(req.body);
                res.send({
                    status: true,
                    data: true
                })
            } catch (e) {
                res.send({
                    status: false,
                    data: e.toString || e.message
                })
            }
        }
    },
    {
        method: "PUT",
        description: "文件目录移动",
        path: "path",
        handle: async (req, res) => {
            console.log(req.body);
            res.send({
                status: true,
                data: true
            })
        }
    }
]

exports.delete = {
    method: "DELETE",
    description: "文件目录删除",
    handle: async (req, res) => {
        console.log(req.body);
        res.send({
            status: true,
            data: true
        })
    }
}