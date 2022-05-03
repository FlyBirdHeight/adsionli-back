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
            let fileWrite = this.fs.openSync(this.path.resolve(options.path, `./${options.hash_key}_${options.idx}`), 'a+');
            file.on('data', (data) => {
                this.fs.appendFileSync(fileWrite, data);
            })
            file.on('close', () => {
                console.log('end');
                this.fs.closeSync(fileWrite)
                resolve({
                    status: true
                })
            })
            file.on('error', () => {
                console.log('error');
                this.fs.closeSync(fileWrite)
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
 * @param {{name: string, hash_key:string, linkPath: string, savePath: string, sliceCount: number, type: string}} options 传入数据
 * @description 这里的操作步骤：1. 找到全部符合条件的分片数据
 * 2. 将分片数据全部写入到同一个文件中去
 * 3. 创建软链接，并触发event，创建到数据库去，然后创建相关的文件夹
 */
const saveMerge = function (options) {
    return new Promise((resolve, reject) => {
        try {
            let nameList = options.name.split('.');
            let deposit = this.path.resolve(options.savePath, `${nameList[0]}_${options.hash_key}.${nameList[1]}`);
            let slicePath = this.path.resolve(global.__dirname, `./${this.config.slice}`, options.hash_key);
            let fd = this.fs.openSync(deposit, 'a+');
            for (let i = 0; i < options.sliceCount; i++) {
                let sliceData = slicePath + '_' + i;
                if (!this.judgeExist(sliceData)) {
                    throw new Error("分片文件不存在！无法完成内容合并！");
                }
                let fileData = this.fs.readFileSync(sliceData);
                this.fs.appendFileSync(fd, fileData);
            }
            this.fs.closeSync(fd);
            this.createLink(deposit, this.path.resolve(options.linkPath, options.name))
            resolve({
                status: true,
                fullPath: deposit,
                name: options.name,
                linkPath: options.linkPath
            })
        } catch (e) {
            reject(new Error("分片合并失败！" + e.message))
        }
    })
}
/**
 * @method save 保存文件
 * @param {ReadableStream} file 文件内容
 * @param {{path: string, name: string}} options 配置参数
 */
const save = function (file, options) {
    return new Promise((resolve, reject) => {
        if (!this.judgeExist(options.path)) {
            this.mkdirDirectory(options.path);
        }
        try {
            let fileWrite = this.fs.createWriteStream(this.path.resolve(options.path, options.name));
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

export {
    saveSlice,
    saveMerge,
    save
}