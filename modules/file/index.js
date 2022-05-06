import { createRequire } from 'module';
import fs from "fs";
import path from "path";
import { save, saveSlice, saveMerge } from "./utils/save.js";
import { createLink, unlinkPath, judgeExist, getLinkPath, getRealPath, mkdirDirectory, deleteFile, deleteDirectory } from "./utils/utils.js"
import { renameFile, renameDirectory } from "./utils/rename.js"
const handleList = {
    save, saveSlice, saveMerge, createLink, unlinkPath, judgeExist, getLinkPath, getRealPath, mkdirDirectory, deleteFile,
    renameFile, renameDirectory, deleteDirectory
}
const require = createRequire(import.meta.url);
/**
 * README: 文件管理系统
 */
class FileSetting {
    constructor() {
        this.fs = fs;
        this.path = path;
        this.config = require('./config/save.json');
        this.registerHandle();
    }

    /**
     * @method registerHandle 注册相关方法
     */
    registerHandle() {
        for (let key of Reflect.ownKeys(handleList)) {
            this[key] = handleList[key].bind(this);
        }
    }
}

export default FileSetting;