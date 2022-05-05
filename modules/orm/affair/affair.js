const getConnect = function () {
    return new Promise((resolve, reject) => {
        this.database.pool.get(this.database.database.get(this.name)).getConnection((error, connection) => {
            if (error) {
                reject(error)
            }
            resolve(connection);
        })
    })
}

/**
 * @method startAffair 开启事务处理
 * @param {boolean} locked 是否开启锁
 */
const startAffair = async function (locked = false) {
    try {
        let conn = await this.getConnect();
        await conn.beginTransaction();

        return conn;
    } catch (e) {
        console.log(e);
        throw e;
    }
}


export {
    startAffair,
    getConnect,
}