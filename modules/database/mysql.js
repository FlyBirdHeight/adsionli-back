import mysql from "mysql";
import { createRequire } from 'module';
import ConnectError from "../../error/database/connect_error.js";
import PoolError from "../../error/database/pool_error.js";
const require = createRequire(import.meta.url);
class Database {
    constructor() {
        this.mysql = mysql;
        this.config = require("../../config/database.json").databases;
        this.database = new Map();
        this.databaseList = [];
        //数据库连接池的状态，分别为disconnect,connect
        this.poolStatus = 'disconnect';
        this.pool = new Map();
    }

    getConfig() {
        return this.config;
    }

    setDatabase(database, name) {
        this.database.set(name, database);
        if (this.databaseList.indexOf(database) === -1) {
            this.databaseList.push(database)
            this.createPool(database);
        }
    }

    createPool(database) {
        let configData = Object.assign({
            connectionLimit: 100
        }, this.config)
        this.pool.set(database, mysql.createPool(configData))
    }

    /**
     * @method usePool 使用数据库连接池进行数据库操作
     * @param {*} sql sql语句
     * @param {*} sqlData 传入的Sql参数
     */
    usePool(name, sql, sqlData = []) {
        if (!this.pool.has(this.database.get(name))) {
            throw new ConnectError("未创建数据库连接池！");
        }
        let pool = this.pool.get(this.database.get(name))
        return new Promise((resolve, reject) => {
            pool.getConnection((error, connection) => {
                if (error) reject(new PoolError(error.message, {
                    sqlMessage: error.sqlMessage
                }));
                connection.query(sql, sqlData, function (error, results, fields) {
                    //完成查询后，释放当前连接，让其返回到数据库连接池中
                    connection.release();
                    if (error) reject(error);
                    resolve(results)
                })
            })
        })
    }
}

export default Database;