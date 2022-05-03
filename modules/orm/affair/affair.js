/**
 * @method startAffair 开启事务处理
 * @param {boolean} locked 是否开启锁
 */
const startAffair = async function (locked = false) {
    //{run, begin, rollback, commit, locks}
    let action = await this.database.mysql.transaction();
    !locked && Reflect.deleteProperty(action, 'locks');

    return action;
}

/**
 * @method useAffair 进行事务处理
 * @param {Function[]} 等待执行的内容
 */
const useAffair = async function(){

}