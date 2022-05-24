import Models from "../../lib/model";

class LearningCard extends Models {
    constructor() {
        super('local', 'learningCard', 'learning_cards', [
            'title', 'creator', 'importance'
        ])
    }

    /**
     * @method hasManyQuestions 闪卡一对多问题
     */
    hasManyQuestions() {
        return this.hasMany('questions', 'id', 'learning_card_id');
    }

    /**
     * @method getLearningCardList 获取闪卡列表
     * @param {{page:number, size:number, sort?: { name: string, type: string }}} options 
     */
    getLearningCardList(options = { page: 1, size: 10, sort: { name: 'sort', type: 'desc' } }) {
        return this.with(['hasManyQuestions']).find({
            page: options.page,
            count: options.size,
            sort: options.sort
        });
    }

    /**
     * @method getLearningCardCount 获取闪卡数量
     */
    async getCount() {
        let count = await this.getCount();

        return count[0].count;
    }

    /**
     * @method getInfo 获取闪卡详情
     * @param {number} id 闪卡id
     */
    getInfo(id) {
        return this.with(['hasManyQuestions']).find({
            where: {
                id
            }
        })
    }
}

export default LearningCard;