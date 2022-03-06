import DataBase from "../modules/database/mysql"
const database = new DataBase();
import request from "request";
class Models {
    constructor(databaseName) {
        database.setDatabase(databaseName);
        this.dateFormat = require("../utils/util");
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

    /**
   * @method requestData 读取配置文件中的数据
   * @param {String} url 请求路径
   */
    requestData(url) {
        return new Promise((resolve, reject) => {
            request({
                url: url,
                method: "GET",
                headers: { 'Content-Type': 'text/json' }
            }, (error, response, body) => {
                if (error !== null) {
                    reject(error);
                }
                let returnData = body ? JSON.parse(body) : null;
                resolve(returnData);
            })
        })
    }
}

export default Models;