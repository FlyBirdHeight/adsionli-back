import { dateFormat } from "../utils/utils.js"
class Models {
    constructor(databaseName, name) {
        this.database = global.database;
        this.database.setDatabase(databaseName, name);
        this.dateFormat = dateFormat;
        this.name = name;
    }
    /**
     * @method set 设置参数
     * @param {*} data 
     */
    set(data) {
        for (let i in data) {
            this[i] = data[i];
        }
    }

    /**
     * @method get 获取指定参数
     * @param {String} number 指定参数
     * @returns {*}
     */
    get(number) {
        let returnData = this[number];
        if (typeof (returnData) == 'undefined') {
            return null;
        }

        return returnData;
    }

    /**
     * @method getAll 获取全部成员变量
     * @returns {*}
     */
    getAll() {
        let returnData = new Object;
        for (let i in this) {
            if (typeof (this[i]) != "function") {
                returnData[i] = this[i];
            }
        }

        return returnData;
    }

    /**
     * @method toString 将全部成员变量按字符串返回
     * @returns {String}
     */
    toString() {
        let returnData = "";
        for (let i in this) {
            if (typeof (this[i]) != "function") {
                returnData += i + ":" + this[i] + "；    ";
            }
        }

        return returnData;
    }
}

export default Models;