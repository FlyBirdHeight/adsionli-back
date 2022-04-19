import WhereKeyObjectError from "../../../error/database/orm/utils/where_key_object";
import WhereError from "../../../error/database/orm/where.error";

/**
 * @method betweenData 用于处理between数据
 * @param {*} data 
 */
const betweenData = function (data, key, table = '') {
    let sql = ' between ';
    if (!Array.isArray(data)) {
        throw new WhereKeyBetweenError(`${table}-${key}`)
    }
    let len = data.length;
    if (len < 2) {
        sql += `${handleDataString(data[0])} and ${handleDataString(data[0])}`
    } else {
        sql += `${handleDataString(data[0])} and ${handleDataString(data[1])}`
    }

    return sql;
}

/**
 * @method handleArrayData 处理数组数据
 * @param {*} data 
 */
const handleArrayData = function (data) {
    let sql = '';
    if (data.length < 2) {
        sql += handleDataString(data[0]);
        return sql;
    }
    for (let i = 0; i < data.length; i++) {
        sql += handleDataString(data[i])
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
const handleDataString = function (data) {
    return typeof data == 'string' ? `'${data}'` : data;
}
/**
 * @method getLink 获取where的连接词
 * @param {*} data
 */
const getLink = function (data, keyL) {
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
 * @method handleWhereType 处理where的特殊搜索要求
 * @param {string} type 类型
 * @param {*} data 查询数据
 * @param {string} key 数据名称
 */
const handleWhereType = function (type, data, key) {
    try {
        let sql = '';
        switch (type) {
            case 'between':
                sql += betweenData(data, key);
                break;
            case '>':
                sql += ` > ${handleDataString(data)}`
                break;
            case '<':
                sql += ` < ${handleDataString(data)}`
                break;
            case '<>':
                sql += ` <> ${handleDataString(data)}`
                break;
            case '>=':
                sql += ` >= ${handleDataString(data)}`
                break;
            case '<=':
                sql += ` <= ${handleDataString(data)}`
                break;
            case 'like':
                sql += ` like ${handleDataString(data)}`
                break;
            case 'not in':
                sql += ` not in (${handleArrayData(data)})`;
                break;
            case '!=':
                sql += ` != ${handleDataString(data)}`;
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
 * @method handleWhereKey 处理where中传入对象属性
 * @param {*} data 待处理数据
 * @param {string} 查询字段名称
 */
const handleWhereKey = function (data, key, table = '') {
    try {
        let sql = key;
        if (Reflect.has(data, 'type') && Reflect.has(data, 'data')) {
            sql += handleWhereType(data.type, data.data, key);
        } else if (Reflect.has(data, 'data')) {
            if (Array.isArray(data.data)) {
                sql += ` in (${handleArrayData(data.data)})`;
            } else {
                sql += ` = ${handleDataString(data.data)} `;
            }
        } else {
            let message = `${table}-${key}`;
            throw new WhereKeyObjectError(message);
        }

        return sql;
    } catch (e) {
        throw e;
    }
}
/**
 * @method handleBrackets 处理where中括号关键字内容的sql
 * @param {*} data
 */
const handleBrackets = function (data) {
    let linkType = "and";
    let sql = '';
    let count = 0;
    if (Reflect.has(data, '_link')) {
        let _link = data['_link'];
        linkType = getLink(_link, Reflect.ownKeys(data).length - 1);
        Reflect.deleteProperty(data, '_link');
    }
    for (let key of Reflect.ownKeys(data)) {
        if (count != 0) {
            sql += ((Array.isArray(linkType) ? linkType[count - 1] : linkType) + ' ');
        }
        if (key == '_brackets') {
            sql += handleBrackets(data[key]);
        } else {
            if (Array.isArray(data[key])) {
                sql += `${key} in (${handleArrayData(data[key])}) `;
            } else if (typeof (data[key]) === 'object') {
                sql += handleWhereKey(data[key], key) + " ";
            } else {
                sql += `${key} = ${handleDataString(data[key])} `;
            }
        }

        count++;
    }

    return `(${sql})`
}

/**
 * @method where 为sql语句添加where
 * @param {*} sql 拼接的sql语句
 * @param {*} data 待查询数据
 */
const where = function (sql, data) {
    try {
        let linkType = "and";
        if (Reflect.ownKeys(data).length != 0) {
            if (Reflect.has(data, '_link')) {
                let _link = data['_link'];
                linkType = getLink(_link, Reflect.ownKeys(data).length - 1);
                Reflect.deleteProperty(data, '_link');
            }
            sql += ' where ';
            let count = 0;
            for (let key of Reflect.ownKeys(data)) {
                if (count != 0) {
                    sql += ((Array.isArray(linkType) ? linkType[count - 1] : linkType) + ' ');
                }
                if (key == '_brackets') {
                    sql += handleBrackets(data[key]);
                } else {
                    if (Array.isArray(data[key])) {
                        sql += `${key} in (${handleArrayData(data[key])}) `;
                    } else if (typeof (data[key]) === 'object') {
                        sql += handleWhereKey(data[key], key, this.table) + " ";
                    } else {
                        sql += `${key} = ${handleDataString(data[key])} `;
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
export {
    where
}