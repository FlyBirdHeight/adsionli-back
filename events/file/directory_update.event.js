import Directories from "../../model/file/directories.js"
const directoryModel = new Directories();
/**
 * README: 专门用来处理文件夹内容的更新
 */
module.exports = {
    "update_directory_size": async (directoryId, size) => {
        try {
            await directoryModel.updateInfo({
                id: directoryId,
                data: size,
                type: 'directory_size'
            })
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    "update_directory_image_count": async (directoryId, image_count) => {
        try {
            await directoryModel.updateInfo({
                id: directoryId,
                data: image_count,
                type: 'image_count'
            })
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    "update_directory_count": async (directoryId, directory_count) => {
        try {
            await directoryModel.updateInfo({
                id: directoryId,
                data: directory_count,
                type: 'directory_count'
            })
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    "update_directory_realPath": async (directoryId, realPath) => {
        try {
            await directoryModel.updateInfo({
                id: directoryId,
                data: realPath,
                type: 'real_path'
            })
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}