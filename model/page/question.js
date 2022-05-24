import Models from "../../lib/model";

class Question extends Models {
    constructor() {
        super('local', 'question', 'questions', [
            'title', 'solution', 'difficulty', 'learning_card_id'
        ])
    }

    /**
     * @method belongsToLearningCard 问题多对一闪卡
     */
    belongsToLearningCard() {
        return this.belongsTo('learning_cards', 'learning_card_id', 'id');
    }

    /**
     * @method updateData 更新问题数据
     * @param {Object | []} data 等待更新数据 
     * @param {boolean} getSql 是否返回sql
     */
    updateData(data, getSql = false) {
        if (!Array.isArray(data)) {
            let id = data.id;
            let set = {};
            for (let key of Reflect.ownKeys(data)) {
                if (key !== 'id') {
                    set[key] = data[key]
                }
            }
            return this.update({
                set,
                where: {
                    id: id
                }
            }, getSql);
        }
        let sql = [];
        for (let item of data) {
            let update = { set: {} }
            for (let key of Reflect.ownKeys(item)) {
                if (key === 'id') {
                    update['where'] = {
                        id: item.id
                    }
                } else {
                    update.set[key] = item[key];
                }
            }
            sql.push(this.update(update), true)
        }

        if (getSql) {
            return sql;
        } else {
            return Promise.all(sql.map(v => {
                return this.update(v);
            }));
        }
    }
}

export default Question;