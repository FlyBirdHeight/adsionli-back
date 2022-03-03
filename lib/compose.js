/**
 * @method compose 执行中间件的函数
 * @param {Array} middleware 中间件的集合
 * @param {string} path 路径名称
 */
function compose(middleware, path) {
    if (!(middleware instanceof Array)) {
        throw new Error(`middlewares ${JSON.stringify(middlewares)} should be an Array of functions.`);
    }
    if (middleware.length) {
        for (const fn of middleware) {
            if (typeof fn !== 'function') {
                throw new Error(`middleware ${path} - ${JSON.stringify(fn)} should be a function, ignored.`);
            }
        }
    }
    //这里的三个参数都会在app中被传入
    return (req, res, next) => {
        //这里设置一个递归函数，将所有的中间件进行执行，执行完毕之后，进入到普通的响应处理中去
        (function iterate(i, max) {
            if (i === max) {
                return next();
            }
            middleware[i](req, res, iterate.bind(this, i + 1, max))
        })(0, middleware);
    }
}

module.exports = compose;