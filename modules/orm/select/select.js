/**
* @method findById 通过id进行寻找
* @param {*} id 
*/
const findById = function (id) {
    try {
        return this.database.usePool(this.name, `select * from ${this.table} where id = ${id} and is_delete = 0`);
    } catch (e) {
        throw e;
    }
}

const findOne = function (condition) {
    try {
        condition['one'] = true;
        return this.select(condition)
    } catch (e) {
        throw e
    }
}

const findAll = function (condition) {
    try {
        condition['all'] = true;
        return this.select(condition)
    } catch (e) {
        throw e
    }
}
/**
* @method select 查找数据内容(不包含分页)
* @param {any} condition 查找条件
*/
const select = function (condition) {
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
        } else if (Reflect.has(condition, 'one')) {
            sql += ` limit 1`
        } else if (Reflect.has(condition, 'all')) {
            sql += ''
        }
        return this.database.usePool(this.name, sql)
    } catch (e) {
        throw e;
    }
}

/**
 * @method getCount 获取检索条数
 * @param {*} condition 
 */
const getCount = function (condition) {
    try {
        condition['select'] = 'count(*)'

        return this.select(condition)
    } catch (e) {
        throw e;
    }
}

export {
    findById,
    select as find,
    findOne,
    findAll,
    getCount
};