import { dateFormat } from "../utils/utils.js"
class Models {
    constructor(databaseName, name, table, insertMember) {
        this.database = global.database;
        this.database.setDatabase(databaseName, name);
        this.dateFormat = dateFormat;
        this.name = name;
        this.table = table;
        this.insertMember = insertMember;
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
     * @method find 查找数据内容(不包含分页)
     * @param {any} condition 查找条件
     */
    find(condition) {
        let sql = `select ${Reflect.has(condition, 'select') ? condition.select : '*'} from ${this.table}`;
        if (Reflect.has(condition, 'where')) {
            sql += ' where ';
            let count = 0;
            for (let key of Reflect.ownKeys(condition.where)) {
                if (count != 0) {
                    sql += 'and ';
                }
                sql += `${key} = ${typeof condition.where[key] == 'string' ? `'${condition.where[key]}'` : condition.where[key]} `;
                count++;
            }
        }
        if (Reflect.has(condition, 'sort')) {
            sql += ` order by ${condition.sort.name} ${condition.sort.type}`
        }
        if (Reflect.has(condition, 'page') && Reflect.has(condition, 'count')) {
            sql += ` limit ${(condition.page - 1) * condition.count}, ${condition.count}`
        }

        sql += ';'
        return this.database.usePool(this.name, sql)
    }

    /**
     * @method insert 往数据库添加数据
     * @param {*} data 
     */
    insert(data) {
        let repeatNum = Reflect.ownKeys(data).length;
        let sql = `insert into ${this.table}(${Reflect.ownKeys(data).join(',')}) value(${'?'.repeat(repeatNum).split('').join(',')});`
        let addData = [];
        for (let v of Reflect.ownKeys(data)) {
            addData.push(data[v]);
        }
        return this.database.usePool(this.name, sql, addData)
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