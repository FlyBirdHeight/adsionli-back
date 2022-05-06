import Directories from "../../model/file/directories.js"
import Files from "../../model/file/files.js"
import path from "path"
const directoryModel = new Directories();
const fileModel = new Files();
/**
 * @method mkdirDirectory 创建文件路径数据库数据
 * @param {string} directoryPath 
 */
const mkdirDirectory = async (directoryPath) => {
    try {
        let dp = directoryPath.replace(path.resolve(global.__dirname, './public/file'), '').split("/").filter(v => {
            return v != ''
        })
        const event = global.eventListener;
        let dirPath = '/file'
        let parentId = [];
        //FIXME: 这里存在问题，我们其实需要对其添加事务，并且加锁，不然的话会造成数据重复，这里现在只是在数据加了unique，有点问题的
        for (let i = 0; i < dp.length; i++) {
            dirPath += '/' + dp[i];
            let has = await directoryModel.hasDirectory(dirPath)
            if (has.has) {
                parentId.push(has.data.id);
                continue;
            }
            let status;
            try {
                status = await directoryModel.addDirectory({
                    name: dp[i],
                    level: i + 1,
                    parent_id: parentId[i - 1],
                    relative_path: dirPath,
                    real_path: path.resolve(global.__dirname, './public', `./${dirPath}`),
                })
            } catch (e) {
                let has = await directoryModel.hasDirectory(dirPath)
                if (has.has) {
                    parentId.push(has.data.id);
                    continue;
                }
            }
            parentId.push(status.insertId);
            event.emit("update_directory_count", [parentId[i - 1], 1])
        }
        return parentId[parentId.length - 1];
    } catch (e) {
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
                let fullPath = fileHandle.path.resolve(slicePath, `./${hashKey}_${i}`);
                fileHandle.deleteFile(fullPath);
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    "save_file": async (fullPath, name, createDirectory, options) => {
        let directory_id;
        if (createDirectory) {
            directory_id = await mkdirDirectory(options.directoryPath)
        } else {
            let data = await directoryModel.find({
                select: 'id',
                where: {
                    relative_path: options.relativeLinkPath
                }
            })
            directory_id = data[0].id
        }
        //NOTE: 创建文件数据
        let status = await fileModel.addFile({
            name,
            link_path: options.link_path,
            size: options.size,
            hash_tag: options.hash_tag,
            directory_id,
            path: fullPath,
            type: options.type == 'image' ? 0 : 1,
            description: '',
            url: Files.generateUrl(options.relativeLinkPath) + '/' + name,
        })

        //NOTE: 再次触发更新数据,更新文件夹大小与文件夹下内容数量
        const event = global.eventListener;
        event.emit("update_directory_size", [directory_id, options.size])
        event.emit("update_directory_image_count", [directory_id, 1])
    }
}