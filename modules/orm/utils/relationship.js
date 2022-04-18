/**
 * @method belongsTo 属于单个的关联
 * @param {string} tables 所属的table名称
 * @param {string} column 本表中的关联字段
 * @param {string} table_column 关联表字段
 */
const belongsTo = function (tables, column, table_column) {
    if (this.belongsList.has(tables)) {
        return this;
    }
    this.belongsList.set(tables, {
        target_key: table_column,
        key: column
    })

    return this;
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
        return this;
    }
    this.belongsManyList.set(c_table, {
        center: c_table,
        center_a_column: c_a_column[0],
        center_b_column: c_b_column[0],
        a_table: a_table,
        b_table,
        a_column: c_a_column[1],
        b_column: c_b_column[1]
    });

    return this;
}

/**
 * @method hasMany 用于多个关联数据(可以单对多，也可以多对多)
 * @param {string} table 拥有的table名称
 * @param {string} column 本表中的对应字段
 * @param {string} table_column 拥有的table中的对应字段
 */
const hasMany = function (table, column, table_column) {
    if (this.hasList.has(table)) {
        return this;
    }
    this.hasList.set(table, {
        target_key: table_column,
        key: column,
        type: 'many'
    })

    return this;
}

/**
 * @method hasOne 单对单拥有关系
 * @param {string} table 拥有的table名称
 * @param {string} column 本表中的对应字段
 * @param {string} table_column 拥有的table中的对应字段
 */
const hasOne = function (table) {
    if (this.hasList.has(table)) {
        return this;
    }
    this.hasList.set(table, {
        target_key: table_column,
        key: column,
        type: "one"
    })

    return this;
}

export {
    hasOne,
    hasMany,
    belongsTo,
    belongsToMany
}