import InsertLoseMember from "../../../error/database/orm/insert/lose_memeber.error.js";

/**
 * @method insert 向数据库添加数据
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


export {
    insert
}