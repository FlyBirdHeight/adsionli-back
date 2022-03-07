const Rule = {
    isNumber: (v) => typeof v === 'number',
    isString: (v) => typeof v === 'string',
    notNullorUndefined: (v) => v ? true : false,
    notEmpty: (v, obj) => Reflect.has(obj, v),
    canEmpty: () => true,
    ObjEqual: (v, obj) => {
        let vK = Reflect.ownKeys(v);
        let oK = Reflect.ownKeys(obj);
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

export default Rule;