var dateFormat = (format, date) => {
    let ret;
    const opt = {
        "y+": date.getFullYear().toString(), // 年
        "M+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "h+": date.getHours().toString(), // 时
        "m+": date.getMinutes().toString(), // 分
        "s+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(format);
        if (ret) {
            format = format.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };

    return format;
}
const getEvent = () => {
    return global.eventListener
}
export { dateFormat, getEvent }