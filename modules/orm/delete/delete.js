const deleteById = function (id, returnSql = false) {
    try {
        let sql = `delete from ${this.table} where id = ${id}`;
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

const destory = function (data, returnSql = false) {
    try {
        let sql = `delete from ${this.table}`;
        if (Array.isArray(data)) {
            sql += ` where id in (${this.handleArrayData(data)});`;
        } else if (data instanceof Object && Reflect.has(data, 'where')) {
            sql = this.where(sql, data.where);
        } else {
            sql += ` where id = ${data};`;
        }
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
    deleteById,
    destory as delete
};