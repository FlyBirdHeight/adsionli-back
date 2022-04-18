const deleteById = function (id) {
    try {
        let sql = `delete from ${this.table} where id = ${id}`;
        this.setBucket('deleteById', sql, {
            data: {
                id
            }
        });
        return this.database.usePool(this.name, sql);
    } catch (e) {
        throw e;
    }
}

const destory = function (data) {
    try {
        let sql = `delete from ${this.table}`;
        if (Array.isArray(data)) {
            sql += ` where id in ${this.handleArrayData(data)};`;
        } else if (data instanceof Object && Reflect.has(data, 'where')) {
            sql = this.where(sql, data.where);
        } else {
            sql += ` where id = ${data};`;
        }

        this.setBucket('deleteById', sql, {
            data
        });
        return this.database.usePool(this.name, sql);
    } catch (e) {
        throw e;
    }
}


export {
    deleteById,
    destory as delete
};