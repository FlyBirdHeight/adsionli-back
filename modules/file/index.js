import { createRequire } from 'module';
import fs from "fs";
import path from "path";
import * as Save from "./utils/save.js";
import * as Utils from "./utils/utils.js"
import * as Rename from "./utils/rename.js"
import * as Delete from "./utils/delete.js";
const handleList = [Save, Utils, Rename, Delete];
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
        for (let module of handleList) {
            for (let fn of Reflect.ownKeys(module)) {
                if (typeof fn !== 'string' || fn === '__esModule') {
                    continue
                }
                this[fn] = module[fn].bind(this);
            }
        }
    }
}

export default FileSetting;