import { dateFormat } from "../utils/utils.js"
import WhereError from "../error/database/orm/where.error"
import UpdateError from "../error/database/orm/update.error"
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
     * @method find 查找数据内容(不包含分页)
     * @param {any} condition 查找条件
     */
    find(condition) {
        try {
            let sql = `select ${Reflect.has(condition, 'select') ? condition.select : '*'} from ${this.table}`;
            if (Reflect.has(condition, 'where')) {
                sql = this.where(sql, condition);
            }
            if (Reflect.has(condition, 'sort')) {
                sql += ` order by ${condition.sort.name} ${condition.sort.type}`
            }
            if (Reflect.has(condition, 'page') && Reflect.has(condition, 'count')) {
                sql += ` limit ${(condition.page - 1) * condition.count}, ${condition.count}`
            }

            sql += ';'
            return this.database.usePool(this.name, sql)
        } catch (e) {
            throw e;
        }
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
     * @method delete 删除数据
     * @param {Number[] | Number} data 待删除数据
     */
    delete(data) {
        try {
            let sql = `delete from ${this.table}`;
            if (Array.isArray(data)) {
                sql += ` where id in ${data.join(',')};`;
            } else if (data instanceof Object) {
                sql = this.where(sql, data);
            } else {
                sql += ` where id = ${data};`;
            }

            return this.database.usePool(this.name, sql);
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method getCount 获取检索条数
     * @param {*} condition 
     */
    getCount(condition) {
        try {
            let sql = `select count(*) from ${this.table}`;
            if (Reflect.has(condition, 'where')) {
                sql = this.where(sql, condition);
            }

            sql += ';'
            return this.database.usePool(this.name, sql)
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method update 更新数据库内容
     * @param {*} data 
     */
    update(data) {
        try {
            sql = `update ${this.table} set `;
            if(Reflect.has(data, 'set') && Reflect.ownKeys(data.set).length != 0){
                let count = 0;
                for(let key of Reflect.ownKeys(data.set)){
                    if(data.set[key] == null || isNaN(data.set[key] || typeof(data.set[key]) == 'undefined')){
                        throw new UpdateValueError(`${this.table}下的${key}`)
                    }else {
                        if(count != 0){
                            sql += ' and '
                        }
                        sql += `${key} = ${data.set[key]}`
                    }
                    count++;
                }
            }else {
                throw new UpdateError(this.table);
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method where 为sql语句添加where
     * @param {*} sql 
     * @param {*} data
     */
    where(sql, data) {
        if (Reflect.has(data, 'where') && Reflect.ownKeys(data.where).length != 0) {
            sql += ' where ';
            let count = 0;
            for (let key of Reflect.ownKeys(data.where)) {
                if (count != 0) {
                    sql += 'and ';
                }
                if (Array.isArray(data.where[key])) {
                    sql += `${key} in (${data.where[key].join(',')})`;
                } else {
                    sql += `${key} = ${typeof data.where[key] == 'string' ? `'${data.where[key]}'` : data.where[key]} `;
                }
                count++;
            }
        } else {
            throw new WhereError(this.table)
        }

        return sql;
    }

}

export default Models;