import InsertLoseMember from "../../../error/database/orm/insert/lose_memeber.error.js";
import InsertMoreTypeError from "../../../error/database/orm/insert/insert_more_type.error.js";
/**
 * @method insert 向数据库添加数据(单一插入)
 * @param {*} data 
 * @param {boolean} returnSql 是否返回sql语句，不执行
 */
const insert = function (data, returnSql = false) {
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
    if (returnSql) {
        return {
            sql, addData
        }
    }
    return this.database.usePool(this.name, sql, addData)
}

/**
 * @method insertMore 批量插入
 * @param {*} data 批量插入的数据
 * @param {boolean} returnSql 是否返回sql语句，不执行
 */
const insertMore = function (data, returnSql = false) {
    if (!Array.isArray(data) || data.length == 0) {
        throw new InsertMoreTypeError('批量插入失败', {
            table: this.table
        })
    }
    let insertKey = Reflect.ownKeys(data[0]);
    let repeatNum = insertKey.length;
    for (let key of this.insertMember) {
        if (insertKey.indexOf(key) === -1) {
            throw new InsertLoseMember(this.table, {
                member: key
            });
        }
    }


    let values = new Array(data.length).fill(`(${'?'.repeat(repeatNum).split('').join(',')})`).join(',');
    let sql = `insert into ${this.table}(${insertKey.join(',')}) values ${values}`;
    let addData = [];
    for (let v of data) {
        for (let key of Reflect.ownKeys(v)) {
            addData.push(v[key])
        }
    }

    if (returnSql) {
        return {
            sql, addData
        }
    }
    return this.database.usePool(this.name, sql, addData)
}


export {
    insert,
    insertMore
}