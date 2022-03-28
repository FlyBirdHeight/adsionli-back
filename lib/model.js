import { dateFormat } from "../utils/utils.js"
import WhereError from "../error/database/orm/where.error"
import UpdateError from "../error/database/orm/update.error"
import UpdateValueError from "../error/database/orm/update/update_value.error"
import InsertLoseMember from "../error/database/orm/insert/lose_memeber.error.js";
import WhereKeyObjectError from "../error/database/orm/utils/where_key_object.js";
import WhereTypeNumberError from "../error/database/orm/utils/where_type_number.js";
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
            let sql = `select ${Reflect.has(condition, 'select') ? condition.select : '*'} from ${Reflect.has(condition, 'table') ? condition.table : this.table}`;
            if (Reflect.has(condition, 'where')) {
                sql = this.where(sql, condition.where);
            }
            if (Reflect.has(condition, 'sort')) {
                sql += ` order by ${condition.sort.name} ${condition.sort.type}`
            }
            if (Reflect.has(condition, 'page') && Reflect.has(condition, 'count')) {
                sql += ` limit ${(condition.page - 1) * condition.count}, ${condition.count}`
            }
            console.log(sql)
            return this.database.usePool(this.name, sql)
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method findById 通过id进行寻找
     * @param {*} id 
     */
    findById(id) {
        try {
            return this.database.usePool(this.name, `select * from ${this.table} where id = ${id} and is_delete = 0`);
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
        for (let key of this.insertMember) {
            if (!Reflect.has(data, key)) {
                throw new InsertLoseMember(this.table, {
                    member: key
                });
            }
        }
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
                sql += ` where id in ${this.handleArrayData(data)};`;
            } else if (data instanceof Object && Reflect.has(data, 'where')) {
                sql = this.where(sql, data.where);
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
            let sql = `select count(*) as count from ${this.table}`;
            if (Reflect.has(condition, 'where')) {
                sql = this.where(sql, condition.where);
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
            let sql = `update ${this.table} set `;
            if (Reflect.has(data, 'set') && Reflect.has(data, 'where') && Reflect.ownKeys(data.set).length != 0 && Reflect.ownKeys(data.where).length != 0) {
                let count = 0;
                for (let key of Reflect.ownKeys(data.set)) {
                    if (!data.set[key] && data.set[key] != 0) {
                        throw new UpdateValueError(`${this.table}下的${key}`)
                    } else {
                        if (count != 0) {
                            sql += ', '
                        }
                        sql += `${key} = ${typeof (data.set[key]) == 'string' ? `'${data.set[key]}'` : data.set[key]}`
                    }

                    count++;
                }
                sql = this.where(sql, data.where);
                return this.database.usePool(this.name, sql);
            } else {
                throw new UpdateError(this.table);
            }
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method where 为sql语句添加where
     * @param {*} sql 拼接的sql语句
     * @param {*} data 待查询数据
     */
    where(sql, data) {
        try {
            let linkType = "and";
            if (Reflect.ownKeys(data).length != 0) {
                if (Reflect.has(data, '_link')) {
                    let _link = data['_link'];
                    linkType = this.getLink(_link, Reflect.ownKeys(data).length - 1);
                    Reflect.deleteProperty(data, '_link');
                }
                sql += ' where ';
                let count = 0;
                for (let key of Reflect.ownKeys(data)) {
                    if (count != 0) {
                        sql += ((Array.isArray(linkType) ? linkType[count - 1] : linkType) + ' ');
                    }
                    if (key == '_brackets') {
                        sql += this.handleBrackets(data[key]);
                    } else {
                        if (Array.isArray(data[key])) {
                            sql += `${key} in (${this.handleArrayData(data[key])}) `;
                        } else if (typeof (data[key]) === 'object') {
                            sql += this.handleWhereKey(data[key], key) + " ";
                        } else {
                            sql += `${key} = ${this.handleDataString(data[key])} `;
                        }
                    }

                    count++;
                }
            } else {
                throw new WhereError(this.table)
            }
            return sql;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method getLink 获取where的连接词
     * @param {*} data
     */
    getLink(data, keyL) {
        let linkType = "and";
        if (Array.isArray(data)) {
            linkType = data.slice();
            let linkL = linkType.length;
            if (linkL > keyL - 1) {
                linkType.splice(keyL - 1, linkL - keyL);
            } else if (linkL < keyL - 1) {
                linkType = linkType.concat(new Array(keyL - linkL).fill('and'))
            }
        } else {
            linkType = data;
        }

        return linkType;
    }

    /**
     * @method handleWhereKey 处理where中传入对象属性
     * @param {*} data 待处理数据
     * @param {string} 查询字段名称
     */
    handleWhereKey(data, key) {
        try {
            let sql = key;
            if (Reflect.has(data, 'type') && Reflect.has(data, 'data')) {
                sql += this.handleWhereType(data.type, data.data, key);
            } else if (Reflect.has(data, 'data')) {
                if (Array.isArray(data.data)) {
                    sql += ` in (${this.handleArrayData(data.data)})`;
                } else {
                    sql += ` = ${this.handleDataString(data.data)} `;
                }
            } else {
                let message = `${this.table}-${key}`;
                throw new WhereKeyObjectError(message);
            }

            return sql;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method handleWhereType 处理where的特殊搜索要求
     * @param {string} type 类型
     * @param {*} data 查询数据
     * @param {string} key 数据名称
     */
    handleWhereType(type, data, key) {
        try {
            let sql = '';
            switch (type) {
                case 'between':
                    sql += this.betweenData(data, key);
                    break;
                case '>':
                    sql += ` > ${this.handleDataString(data)}`
                    break;
                case '<':
                    sql += ` < ${this.handleDataString(data)}`
                    break;
                case '<>':
                    sql += ` <> ${this.handleDataString(data)}`
                    break;
                case '>=':
                    sql += ` >= ${this.handleDataString(data)}`
                    break;
                case '<=':
                    sql += ` <= ${this.handleDataString(data)}`
                    break;
                case 'like':
                    break;
                default:
                    break;
            }

            return sql;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method isNumber 是否是数字的判断，用于where中
     * @param {*} data 
     * @param {string} cal 
     */
    isNumber(data, key, cal) {
        if (typeof data !== 'number') {
            throw new WhereTypeNumberError(`${this.table}-${key}`, {
                cal: cal
            });
        }

        return true;
    }

    /**
     * @method betweenData 用于处理between数据
     * @param {*} data 
     */
    betweenData(data, key) {
        let sql = ' between ';
        if (!Array.isArray(data)) {
            throw new WhereKeyBetweenError(`${this.table}-${key}`)
        }
        let len = data.length;
        if (len < 2) {
            sql += `${this.handleDataString(data[0])} and ${this.handleDataString(data[0])}`
        } else {
            sql += `${this.handleDataString(data[0])} and ${this.handleDataString(data[1])}`
        }

        return sql;
    }

    /**
     * @method handleArrayData 处理数组数据
     * @param {*} data 
     */
    handleArrayData(data) {
        let sql = '';
        for (let i = 0; i < data.length; i++) {
            sql += this.handleDataString(data[i])
            if (i != data.length - 1) {
                sql += ','
            }
        }

        return sql;
    }

    /**
     * @method handleDataString 处理数据为字符串信息
     * @param {string} sql
     * @param {*} data
     */
    handleDataString(data) {
        return typeof data == 'string' ? `'${data}'` : data;
    }

    /**
     * @method handleBrackets 处理where中括号关键字内容的sql
     * @param {*} data
     */
    handleBrackets(data) {
        let linkType = "and";
        let sql = '';
        let count = 0;
        if (Reflect.has(data, '_link')) {
            let _link = data['_link'];
            linkType = this.getLink(_link, Reflect.ownKeys(data).length - 1);
            Reflect.deleteProperty(data, '_link');
        }
        for (let key of Reflect.ownKeys(data)) {
            if (count != 0) {
                sql += ((Array.isArray(linkType) ? linkType[count - 1] : linkType) + ' ');
            }
            if (key == '_brackets') {
                sql += this.handleBrackets(data[key]);
            } else {
                if (Array.isArray(data[key])) {
                    sql += `${key} in (${this.handleArrayData(data[key])}) `;
                } else if (typeof (data[key]) === 'object') {
                    sql += this.handleWhereKey(data[key], key) + " ";
                } else {
                    sql += `${key} = ${this.handleDataString(data[key])} `;
                }
            }

            count++;
        }

        return `(${sql})`
    }
}

export default Models;