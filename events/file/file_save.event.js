import Directories from "../../model/file/directories.js"
import Files from "../../model/file/file.js"
import path from "path"
const directoryModel = new Directories();
const fileModel = new Files();
/**
 * @method mkdirDirectory 创建文件路径数据库数据
 * @param {string} directoryPath 
 */
const mkdirDirectory = async (directoryPath) => {
    try {
        let dp = directoryPath.replace(path.resolve(global.__dirname, './public/file')).split("/").filter(v => {
            return v != ''
        })
        dp.pop();
        let dirPath = '/file'
        let parentId = [];
        for(let i = 0; i < dp.length; i++){
            dirPath += dp[i];
            let has = await directoryModel.hasDirectory(dirPath)
            if(has.has){
                parentId.push(has.data.id);
                continue;
            }
            let status = await directoryModel.addDirectory({
                name: dp[i],
                level: i + 1,
                parent_id: parentId[i - 1],
                full_path: dirPath,
                real_path: path.resolve(global.__dirname, './public', `./${dirPath}`),
            })
            console.log(status);
            break;
            parentId.push(status.id);
        }
    }catch(e){
        console.log(e);
        throw e;
    }
}


module.exports = {
    "delete_slice": async (hashKey, sliceCount) => {
        try {
            let fileHandle = global.file;
            let slicePath = fileHandle.path.resolve(global.__dirname, `./${fileHandle.config.slice}`);
            for (let i = 0; i < sliceCount; i++) {
                let fullPath = fileHandle.path.resolve(slicePath, `./${hashKey}_i`);
                fileHandle.deleteFile(fullPath);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    "save_file": async (fullPath, name, createDirectory, options) => {
        if (createDirectory) {
            await mkdirDirectory(options.directoryPath)
        }
        
    }
}