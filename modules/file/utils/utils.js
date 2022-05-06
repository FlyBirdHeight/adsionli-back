/**
 * README: 常用的文件操作工具类的集合
 */

/**
 * @method createLink 创建软链接
 * @param {string} file 源文件路径
 * @param {string} linkPath 软链接路径
 */
const createLink = function (file, linkPath) {
    try {
        let fileExist = this.judgeExist(file);
        if (!fileExist) {
            throw new Error("源文件不存在!")
        }
        let linkPathList = linkPath.substr(0).split('/').filter(v => {
            return v != '';
        });
        linkPathList.pop();
        linkPathList = "/" + linkPathList.join("/")
        let linkExist = this.judgeExist(this.path.normalize(linkPathList));
        // //NOTE: 如果软链接的前置路径不存在的话，就会去创建一个前置路径，当然这里要注意，必须提供完整路径且一级一级创建，不然会报错
        if (!linkExist) {
            linkPathList = linkPathList.substr(0).split('/').filter(v => {
                return v != '';
            }).slice(8);
            let path = this.path.resolve(global.__dirname, './public/file/link');
            for (let i = 0; i < linkPathList.length; i++) {
                path = this.path.resolve(path, `./${linkPathList[i]}`);
                if (!this.judgeExist(path)) {
                    this.fs.mkdirSync(path);
                }
            }
        }
        this.fs.symlinkSync(file, linkPath);
        return this;
    } catch (e) {
        console.log(e)
        throw e;
    }
}
/**
 * @method unlinkPath 解除软链接
 * @param {*} file 源文件地址
 * @param {*} linkPath 软链接地址
 */
const unlinkPath = function (file, linkPath) {
    try {
        let linkedPath = this.getLinkPath(file);
        console.log(linkedPath);
        if (linkedPath !== linkPath) {
            throw new Error("当前文件的真实软链接地址与传入的软链接地址不匹配");
        }
        this.fs.unlinkSync(linkPath);
        return this;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

/**
 * @method judgeExist 判断文件/文件夹是否存在
 * @param {string} path 文件/文件夹路径
 */
const judgeExist = function (path) {
    return this.fs.existsSync(path)
}
/**
 * @method mkdirDirectory 创建目录
 * @param {string} path 
 * @param {boolean} parse 是否规范化
 */
const mkdirDirectory = function (path, parse = true) {
    try {
        let realDirectory = parse ? this.path.parse(path).dir : path;
        if (this.judgeExist(realDirectory)) {
            return this;
        }
        let newPath = this.path.normalize(realDirectory);
        let pathList = newPath.replace(global.__dirname, '').split(this.path.sep).filter(v => v != '');
        let pathCur = '';
        for (let i = 0; i < pathList.length; i++) {
            pathCur = this.path.resolve(pathCur, pathList[i]);
            if (this.judgeExist(pathCur)) {
                continue;
            }
            this.fs.mkdirSync(pathCur);
        }
        return this;
    } catch (e) {
        console.log(e);
        throw e;
    }
}
/**
 * @method getLinkPath 获取软链接地址
 * @param {*} path 源文件地址
 */
const getLinkPath = function (path) {
    return this.fs.readlinkSync(path);
}

/**
 * @method getRealPath 获取真实的文件路径
 * @param {*} path 
 */
const getRealPath = function (path) {
    return this.fs.realpathSync(path);
}

/**
 * @method deleteFile 删除文件
 * @param {*} path 文件路径
 */
const deleteFile = function (path) {
    if (!this.judgeExist(path)) {
        throw new Error("当前文件路径不存在:" + path)
    }
    this.fs.unlinkSync(path);
    return this;
}
/**
 * @method deleteDirectory 删除文件目录
 * @param {string} path 目录地址
 */
const deleteDirectory = async function (path) {
    try {
        if (!this.judgeExist(path)) {
            throw new Error("当前目录路径不存在:" + path)
        }
        await this.fs.promises.rm(path, {
            recursive: true,
            force: true
        })
        return true
    } catch (e) {
        throw e;
    }
}

export {
    createLink,
    unlinkPath,
    judgeExist,
    getLinkPath,
    getRealPath,
    mkdirDirectory,
    deleteFile,
    deleteDirectory
}