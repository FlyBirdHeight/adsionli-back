const Rule = {
    isNumber: (v) => typeof v === 'number',
    isString: (v) => typeof v === 'string',
    notNullorUndefined: (v) => v ? true : false,
    notEmpty: (v, obj) => Reflect.has(obj, v),
    canEmpty: () => true,
    ObjEqual: (v, obj) => {
        let vK = Reflect.ownKeys(v);
        let oK = Reflect.ownKeys(v);
        if (vK.length != oK.length) {
            return false
        }
        for (let value of vK) {
            if (oK.indexOf(value) === -1) {
                return false;
            }
        }
        return true;
    }
}
class Filter {
    constructor(rules, data) {
        this.rules = rules;
        this.data = data;
    }

    /**
     * @method verification 验证数据是否通过
     */
    verification() {
        for (let key of Reflect.ownKeys(this.data)) {
            if (!Reflect.has(this.rules, key)) {
                continue;
            }
            for (let rule of Reflect.ownKeys(this.rules)) {
                if (!Reflect.has(Rule, rule)) {
                    continue;
                } else {
                    Filter.verData()
                }
            }
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
        switch (rule) {
            case 'isNumber':
                Rule.isNumber(data[key])
                break;
            case 'isString':
                Rule.isString(data[key])
                break;
            case 'notNullorUndefined':
                Rule.notNullorUndefined(data[key])
                break;
            case 'notEmpty':
                Rule.notEmpty(data[key])
                break;
            case 'canEmpty':
                Rule.canEmpty(data[key])
                break;
            case 'ObjEqual':
                Rule.ObjEqual(data[key], ruleData[key])
                break;
            default:
                break;
        }
    }
}

export default Filter;