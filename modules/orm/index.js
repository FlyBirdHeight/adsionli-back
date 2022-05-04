import * as Select from "./select/select.js"
import * as Delete from "./delete/delete.js"
import * as Update from "./update/update.js"
import * as Insert from "./insert/insert.js";
import * as Relationship from "./utils/relationship.js"
import * as Where from "./utils/where.js"
import * as Utils from "./utils/utils.js"
import * as Affair from "./affair/affair.js"
const options = [
    Select, Delete, Update, Insert, Relationship, Where, Utils, Affair
]
const JointQuery = ["find_all", "find_one", "find", "find_by_id"]
class DatabaseOrm {
    constructor() {
        /**
         * @property {Map} handleBucket 用来存储每一步操作的Map
         * @property {boolean} jointQuery 判断当前次查询是否是联合查询
         */
        this.handleBucket = new Map();
        this.jointQuery = false;
        this.registerOptions();
    }
    /**
     * @method setBucket 将操作添加到Map中
     * @param {string} type 操作类型
     * @param {string} sql 当前次的sql
     * @param {*} options 额外携带参数
     */
    setBucket(type, sql, options = null) {
        this.handleBucket.set(type, {
            type,
            step: this.handleBucket.size + 1,
            sql,
            options
        });

        return this;
    }

    /**
     * @method getBucket 获取操作桶
     * @param {number} step 指定步骤数，可以不指定
     */
    getBucket(step = -1) {
        if (step !== -1) {
            if (step > this.handleBucket.size) {
                return null;
            }
            this.handleBucket.forEach(v => {
                if (v.step == step) {
                    return v;
                }
            })
        }

        return this.handleBucket;
    }

    /**
     * @method cleanupBucket 清空操作Map
     */
    cleanupBucket() {
        this.handleBucket.clear();
        return this;
    }

    /**
     * @method judgeJointQuery 判断是否为联合查询
     */
    judgeJointQuery() {
        return this.jointQuery;
    }

    /**
     * @method registerOptions 注册操作方法
     */
    registerOptions() {
        for (let module of options) {
            for (let fn of Reflect.ownKeys(module)) {
                if (typeof fn !== 'string' || fn === '__esModule') {
                    continue
                }
                this[fn] = module[fn].bind(this);
            }
        }
    }
}

export default DatabaseOrm;