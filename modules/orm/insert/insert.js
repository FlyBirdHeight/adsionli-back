import InsertLoseMember from "../../../error/database/orm/insert/lose_memeber.error.js";

const insert = function (data) {
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

    return this.database.usePool(this.name, sql, addData)
}


export {
    insert
}