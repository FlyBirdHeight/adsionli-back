'use strict'
const glob = require('glob');
const fs = require('fs');
const METHOD_ENUM = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
const compose = require('./lib/compose')
const getController = (path) => {
    let res = [];
    const fileList = glob.sync(`${path}/*`);
    for (let value of fileList) {
        const info = fs.statSync(value);
        if (info.isDirectory(value)) {
            res = res.concat(getController(value))
        } else if (info.isFile(value)) {
            if (value.match(/.+\.controller\.js$/gi)) {
                res.push(value)
            }
        }
    }

    return res;
}
const loader = (app, root, options) => {
    const routers = getController(`${root}`)
    const opt = options || {};
    if (routers.length != 0) {
        for (let route of routers) {
            //获取文件，用于执行require，把最后的.js给舍弃掉
            const filePath = route.replace(/\.[^.]*$/, '');
            //引入对应controller文件下的内容
            const controller = require(filePath);
            //创建相应的请求路径
            let urlPrefix = filePath.replace(root, '').replace(/\.controller/gi, '').split('/');
            if (urlPrefix[urlPrefix.length - 2] == urlPrefix[urlPrefix.length - 1]) {
                urlPrefix.pop();
            }
            urlPrefix = urlPrefix.join('/')
            const methods = Reflect.ownKeys(controller);
            /**
             * @property {Array} excludeRules 被屏蔽的路由
             * @property {Map} rewriteRules 被复写的路由，可以理解为路由替代
             */
            const excludeRules = opt.excludeRules || [];
            const rewriteRules = opt.rewriteRules || new Map();

            function applyMethod(name, body) {
                /**
                 * @property {string} modifiedUrl 请求路径
                 * @property {Array} middlewares 使用的中间件，比如过滤器等等
                 * @property {string} method 请求的方法
                 * @property {function} handle 处理方法，也就是请求响应的处理
                 * @property {string} params 自定义请求路径，也就是扩展的请求路径
                 */
                let modifiedUrl = `${urlPrefix}/${name}`;
                let middlewares = [];
                let method = 'GET';
                let handle;
                let params;
                //@NOTE 这里就是对相关数据在进行处理赋值
                switch (typeof body) {
                    case 'object':
                        params = body.params || [];
                        middlewares = body.middlewares || [];
                        modifiedUrl += `/${params.join('/')}`;
                        handle = body.handle;
                        method = (body.method || 'GET').toUpperCase();
                        break;
                    case 'function':
                        handle = body;
                        break;
                    default: return;
                }

                function applyUrl(url) {
                    //这里就是往app.router中开始注册，用于请求函数的执行,compose函数会返回一个中间件执行的IIFE函数,这里实际上就是传入了三个相应的参数给到app.get方法中去了
                    //可以看一下express官方的文档进行查看的https://www.expressjs.com.cn/5x/api.html#app.get.method
                    app[method.toLowerCase()](
                        rewriteRules.has(url) ? rewriteRules.get(url) : url,
                        compose(middlewares, url),
                        handle
                    );
                }

                if (excludeRules.indexOf(modifiedUrl) !== -1) {
                    // Nothing to-do with the excluded rules
                } else if (METHOD_ENUM.indexOf(method) !== -1) {
                    if (!handle) throw Error('[express-load-router]: no handler for method: ' + method);
                    // 这里兼容两种 index 的访问方式
                    applyUrl(modifiedUrl);
                    if (name === 'index') {
                        applyUrl(`${modifiedUrl}/index`);
                    }
                } else {
                    console.log(method)
                    throw Error('[load-router]: invalid method: ' + method);
                }
            }

            methods.forEach((method) => {
                const name = method;
                const body = controller[method];
                if (body instanceof Array) {
                    //这里支持路由的嵌套，不过只支持一层，多层暂不支持
                    body.forEach(m => {
                        if (Reflect.has(m, 'path')) {
                            applyMethod(`${name}/${m['path']}`, m)
                        }
                    })
                } else {
                    applyMethod(name, body)
                }
            })
        }
    }
}

module.exports = loader;