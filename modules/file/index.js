import fs from "fs";
import path from "path";
import FilePath from "./config/save.json"
import { save, saveSlice, saveMerge } from "./utils/save";
const handleList = {

}

/**
 * README: 文件管理系统
 */
class FileSetting {
    constructor() {
        this.fs = fs;
        this.path = path;
        this.config = FilePath;
    }

    /**
     * @method registerHandle 注册相关方法
     */
    registerHandle() {
        for (let key of Reflect.ownKeys(handleList)) {

        }
    }
}

export default FileSetting;