import Rule from "./rule"
class Filter {
    constructor(rules, data) {
        this.rules = rules;
        this.data = data;
    }

    /**
     * @method verification 验证数据是否通过
     */
    verification() {
        try {
            for (let key of Reflect.ownKeys(this.data)) {
                console.log(key);
                if (!Reflect.has(this.rules, key)) {
                    continue;
                }
                for (let rule of Reflect.ownKeys(this.rules)) {
                    if (this.rules[rule] instanceof Array) {
                        this.rules[rule].forEach(v => {
                            Filter.verData(v, key, this.data, this.rules)
                        })
                    } else {
                        Filter.verData()
                    }
                }
            }
            return true;
        } catch (e) {
            throw e;
        }
    }


    /**
     * @method verData 验证数据
     * @param {string} rule 
     * @param {string} key 
     * @param {Object | any} data 
     * @param {Object} ruleData 
     */
    static verData(rule, key, data, ruleData) {
        let status;
        switch (rule) {
            case 'isNumber':
                status = Rule.isNumber(data[key])
                if (!status) {
                    throw new FilterError(`${key} is not number!`);
                }
                break;
            case 'isString':
                status = Rule.isString(data[key])
                if (!status) {
                    throw new FilterError(`${key} is not string!`);
                }
                break;
            case 'notNullorUndefined':
                status = Rule.notNullorUndefined(data[key])
                if (!status) {
                    throw new FilterError(`${key} is null or undefined!`);
                }
                break;
            case 'notEmpty':
                status = Rule.notEmpty(key, data)
                if (!status) {
                    throw new FilterError(`${key} is empty, please pass in the current property！`);
                }
                break;
            case 'canEmpty':
                Rule.canEmpty(data[key])
                break;
            case 'ObjEqual':
                status = Rule.ObjEqual(data[key], ruleData[key])
                if (!status) {
                    throw new FilterError(`${key} requires that the incoming property does not match the template property!`);
                }
                break;
            default:
                break;
        }

        return true;
    }
}

export default Filter;