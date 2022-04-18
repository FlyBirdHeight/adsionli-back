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
        if(!Reflect.has(req.query, 'id')){
            res.status(500).send({
                status: false,
                message: "必须传入文件夹id"
            })
        }
        let data = await fileService.getDirectoryInfo(Number(req.query.id));
        res.send({
            status: true,
            data: data
        })
    }
}