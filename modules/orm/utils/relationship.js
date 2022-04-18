/**
 * @method belongsTo 属于单个的关联
 * @param {string} table 所属的table名称
 * @param {string} column 本表中的关联字段
 * @param {string} table_column 关联表字段
 */
const belongsTo = function (table, column, table_column) {
    if (this.belongsList.has(table)) {
        return this.belongsList.get(table);
    }
    this.belongsList.set(table, {
        target_key: table_column,
        key: column,
        type: "belongs_to",
        sql: "",
        table
    })

    return this.belongsList.get(table);
}

/**
 * @method belongsToMany 多对多，这里需要中间表进行关联了
 * @param {string} a_table 本身table的名字
 * @param {string} b_table 关联table的名字
 * @param {string} c_table 中间表的名字
 * @param {string[]} c_a_column 中间表中a表字段名及a表字段名
 * @param {string[]} c_b_column 中间表中b表字段名及a表字段名
 */
const belongsToMany = function (a_table, b_table, c_table, c_a_column, c_b_column) {
    if (this.belongsManyList.has(c_table)) {
        return this.belongsManyList.get(c_table);
    }
    this.belongsManyList.set(c_table, {
        center: c_table,
        center_a_column: c_a_column[0],
        center_b_column: c_b_column[0],
        a_table,
        b_table,
        a_column: c_a_column[1],
        b_column: c_b_column[1],
        sql: "",
        type: "belongs_many"
    });

    return this.belongsManyList.get(c_table);
}

/**
 * @method hasMany 用于多个关联数据(可以单对多，也可以多对多)
 * @param {string} table 拥有的table名称
 * @param {string} column 本表中的对应字段
 * @param {string} table_column 拥有的table中的对应字段
 */
const hasMany = function (table, column, table_column) {
    if (this.hasList.has(table)) {
        return this.hasList.get(table);
    }
    this.hasList.set(table, {
        target_key: table_column,
        key: column,
        type: 'has_many',
        sql: "",
        table
    })

    return this.hasList.get(table);
}

/**
 * @method hasOne 单对单拥有关系
 * @param {string} table 拥有的table名称
 * @param {string} column 本表中的对应字段
 * @param {string} table_column 拥有的table中的对应字段
 */
const hasOne = function (table) {
    if (this.hasList.has(table)) {
        return this.hasList.get(table);
    }
    this.hasList.set(table, {
        target_key: table_column,
        key: column,
        type: "has_one",
        sql: "",
        table
    })

    return this.hasList.get(table);
}
/**
 * @method categoricalData 归类数据
 * @param {string} target_key 匹配数据的字段名
 * @param {string} key 原表中字段名
 * @param {*} mainData 等待匹配的数据
 * @param {*} handleData 额外添加数据
 */
const categoricalData = (target_key, key, mainData, handleData, table) => {
    mainData = mainData.map(v => {
        v[table] = [];
        return v;
    })
    if (handleData.length == 0) {
        return;
    }
    for (let value of handleData) {
        for (let main of mainData) {
            if (value[target_key] === main[key]) {
                main[table].push(value);
                break;
            } else {
                continue;
            }
        }
    }
}
/**
 * @method handleJointQuery 专门用于处理联合查询
 * @param {string} endFind 最后一次查询内容
 */
const handleJointQuery = async function (endFind) {
    let endHandle = this.handleBucket.get(endFind);
    let mainData = await this.database.usePool(this.name, endHandle.sql);
    if (mainData.length == 0) {
        return [];
    }
    let withInfo = this.handleBucket.get('with').options.data;
    this.cleanupBucket();
    if (!withInfo || withInfo.length == 0) {
        return mainData;
    }
    //NOTE:这里直接重置掉，避免影响下面的内容，因为下面的内容可能传入的也包含with，再是一个function的时候
    this.jointQuery = false;
    for (let query of withInfo) {
        let findData = [];
        for (let v of mainData) {
            findData.push(v[query.key])
        }
        let child = [];
        let where = {};
        if (query.table == this.table) {
            where[query.target_key] = findData;
            where[query.key] = {
                type: 'not in',
                data: findData
            }
        } else {
            where[query.target_key] = findData
        }
        child = await this.find({
            table: query.table,
            where
        })

        categoricalData(query.target_key, query.key, mainData, child, query.table);
    }

    return mainData;
}

export {
    hasOne,
    hasMany,
    belongsTo,
    belongsToMany,
    handleJointQuery
}