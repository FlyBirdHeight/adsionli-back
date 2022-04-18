import { dateFormat } from "../utils/utils.js"
import DatabaseOrm from "../modules/orm/index.js";
class Models extends DatabaseOrm{
    constructor(databaseName, name, table, insertMember) {
        super()
        /**
         * @property {*} database 数据库对象上下文
         * @property {*} dateFormat 用于处理日期的
         * @property {string} name 当前Model的名称
         * @property {string} table 对应table的名称
         * @property {*} insertMember 用于添加操作时，必须要具备的内容
         * @property {Map} belongsList 单对单关系时的关联表
         * @property {Map} belongsManyList 多对多关系时的关联数据
         * @property {Map} hasList 单对多关系/单对单时拥有的数据
         */
        this.database = global.database;
        this.database.setDatabase(databaseName, name);
        this.dateFormat = dateFormat;
        this.name = name;
        this.table = table;
        this.insertMember = insertMember;
        this.belongsList = new Map();
        this.belongsManyList = new Map();
        this.hasList = new Map();
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