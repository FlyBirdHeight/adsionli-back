import * as Select from "./select/select.js"
import * as Delete from "./delete/delete.js"
import * as Update from "./update/update.js"
import * as Insert from "./insert/insert.js";
import * as Relationship from "./utils/relationship.js"
import * as Where from "./utils/where.js"
const options = [
    Select, Delete, Update, Insert, Relationship, Where
]

class DatabaseOrm {
    constructor() {
        this.registerOptions();
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