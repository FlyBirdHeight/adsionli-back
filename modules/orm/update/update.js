import UpdateValueError from "../../../error/database/orm/update/update_value.error.js"
import UpdateError from "../../../error/database/orm/update.error.js"
/**
 * @method update 更新数据库内容
 * @param {*} data 
 */
const update = function (data) {
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

export {
    update
}


