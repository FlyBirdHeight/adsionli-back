/**
 * README: 专门用于处理文件保存的内容
 */

/**
 * @method saveSlice 保存分片文件
 * @param {ReadableStream} file 文件读取流
 * @param {{hash_key: string, idx: number, path:string}} options 配置属性
 */
const saveSlice = function (file, options) {
    return new Promise((resolve, reject) => {
        try {
            let fileWrite = this.fs.createWriteStream(this.path.resolve(options.path, `/${options.hash_key}_${options.idx}`));
            file.on('data', (data) => {
                fileWrite.write(data);
            })
            file.on('end', () => {
                fileWrite.end();
                resolve({
                    status: true
                })
            })
            file.on('error', () => {
                fileWrite.end();
                reject({
                    status: false,
                    message: "读取并写入文件时发生错误"
                })
            })
        } catch (e) {
            reject({
                status: false,
                message: "读取并写入文件时发生错误:" + e.message
            })
        }
    })
}
/**
 * @method saveMerge 保存合并文件
 * @param {{name: string, hash_key:string, linkPath: string}} options 传入数据
 * @description 这里的操作步骤：1. 找到全部符合条件的分片数据
 * 2. 将分片数据全部写入到同一个文件中去
 * 3. 
 */
const saveMerge = function (options) {

}
/**
 * @method save 保存文件
 * @param {*} file 文件内容
 * @param {*} options 配置参数
 */
const save = function (file, options) {

}

export {
    saveSlice,
    saveMerge,
    save
}