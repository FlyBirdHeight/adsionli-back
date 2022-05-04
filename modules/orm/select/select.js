

/**
* @method findById 通过id进行寻找
* @param {*} id 查询数据id
* @param {boolean} returnSql 是否返回sql语句，不执行
*/
const findById = function (id, returnSql = false) {
    try {
        let sql = `select * from ${this.table} where id = ${id}`;

        if (!this.judgeJointQuery()) {
            if (returnSql) {
                return { sql };
            }
            return this.database.usePool(this.name, sql);
        }
        return this.handleJointQuery(sql);
    } catch (e) {
        throw e;
    }
}
/**
* @method select 查找一条数据
* @param {any} condition 查找条件
* @param {boolean} returnSql 是否返回sql语句，不执行
*/
const findOne = function (condition, returnSql = false) {
    try {
        condition['one'] = true;
        return this.select(condition, 'find_one', returnSql)
    } catch (e) {
        throw e
    }
}
/**
* @method findAll 查找全部(不包含分页)
* @param {any} condition 查找条件
* @param {boolean} returnSql 是否返回sql语句，不执行
*/
const findAll = function (condition, returnSql = false) {
    try {
        condition['all'] = true;
        return this.select(condition, 'find_all', returnSql)
    } catch (e) {
        throw e
    }
}
/**
* @method select 查找数据内容(不包含分页)
* @param {any} condition 查找条件
* @param {string} type 查询类型
* @param {boolean} returnSql 是否返回sql语句，不执行
*/
const select = function (condition, type = 'find', returnSql = false) {
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
        } else if (type == 'find_one') {
            sql += ` limit 1`
        } else if (type == 'find_all') {
            sql += ''
        }

        if (!this.judgeJointQuery()) {
            if (returnSql) {
                return { sql };
            }
            return this.database.usePool(this.name, sql);
        }
        return this.handleJointQuery(sql);
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

        return this.find(condition, 'get_count')
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