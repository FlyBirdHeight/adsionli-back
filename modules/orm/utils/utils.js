import WithNotHaveFn from "../../../error/database/orm/utils/with_not_have_fn.error.js"
const validateWith = (model, fn) => {
    if (!Reflect.has(model, fn)) {
        throw new WithNotHaveFn("联合查询失败！", {
            fn
        })
    }

    return true;
}
/**
 * @method with 联合查询相关hasMany,hasOne的数据
 * @param {[] | string} fn
 */
const withTable = function (fn) {
    try {
        if (typeof (fn) === 'string') {
            validateWith(this, fn);
            let data = this[fn]();
            this.setBucket('with', '', {
                data
            })
        } else if (Array.isArray(fn) && fn.length > 0) {
            let handleData = [];
            for (let f of fn) {
                validateWith(this, f);
                let data = this[f]();
                handleData.push(data);
            }
            this.setBucket('with', '', {
                data: handleData
            })
        } else {
            return this;
        }
        this.jointQuery = true;

        return this;
    } catch (e) {
        throw e;
    }
}


export {
    withTable as with
}