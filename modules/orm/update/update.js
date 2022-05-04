import UpdateValueError from "../../../error/database/orm/update/update_value.error.js"
import UpdateError from "../../../error/database/orm/update.error.js"
/**
 * @method update 更新数据库内容
 * @param {*} data 
 * @param {boolean} returnSql 是否返回sql语句，不执行
 */
const update = function (data, returnSql = false) {
    try {
        let sql = `update ${this.table} set `;
        if (!Reflect.has(data, 'set') || !Reflect.has(data, 'where') || Reflect.ownKeys(data.set).length == 0 || Reflect.ownKeys(data.where).length == 0) {
            throw new UpdateError(this.table);
        }
        let count = 0;
        for (let key of Reflect.ownKeys(data.set)) {
            if (!data.set[key] && data.set[key] != 0) {
                throw new UpdateValueError(`${this.table}下的${key}`)
            }
            if (count != 0) {
                sql += ', '
            }
            if (typeof data.set[key] != 'object') {
                sql += `${key} = ${typeof (data.set[key]) == 'string' ? `'${data.set[key]}'` : data.set[key]}`
            } else {
                sql += `${key} = ${data.set[key].data}`;
            }

            count++;
        }
        sql = this.where(sql, data.where);
        if (returnSql) {
            return {
                sql
            }
        }
        return this.database.usePool(this.name, sql);
    } catch (e) {
        throw e;
    }
}

export {
    update
}


