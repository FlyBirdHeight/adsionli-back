import Service from "../../../lib/service.js"
import LearningCard from "../../../model/page/learning_card.js";
import Question from "../../../model/page/question.js";

class LearningCardService extends Service {
    constructor() {
        super();
        this.cardModel = new LearningCard();
        this.questionModel = new Question();
    }

    /**
     * @method createCard 创建学习闪卡
     * @param {*} insertData 创建的数据
     */
    async createCard(insertData) {
        let questions = insertData.questions.slice(0);
        //NOTE: 开启事务，这里随意一个Model都可以开启事务，所以随意选择一个就可以了
        let connection = await this.cardModel.startAffair(true);
        try {
            Reflect.deleteProperty(insertData, 'questions');
            insertData['question_count'] = questions.length;
            //NOTE: 这里需要注意一下，需要先resolve掉card的添加，然后向question所有项中插入返回的id
            let insertCardSql = await this.cardModel.insert(insertData, true);
            let result = await new Promise((resolve, reject) => {
                connection.query(insertCardSql.sql, insertCardSql.addData, function (error, results) {
                    if (error) {
                        reject(error)
                    }
                    resolve(results)
                })
            });
            questions = questions.map(v => {
                v['learning_card_id'] = result.insertId;
                return v;
            })
            let insertMoreQuestionSql = await this.questionModel.insertMore(questions, true);
            await connection.query(insertMoreQuestionSql.sql, insertMoreQuestionSql.addData)

            await connection.commit();
            return true;
        } catch (e) {
            await connection.rollback();
            console.log(e);
            throw e;
        }
    }

    /**
     * @method editData 修改闪卡数据
     * @param {*} updateData 待修改数据
     */
    async editData(updateData) {
        let findData = await this.cardModel.findById(updateData.id);
        let questionUpdateSql;
        if (findData.length === 0) {
            throw new Error('当前闪卡数据已删除！')
        }
        //NOTE: 前端会先判断是否需要更新问题，如果需要更新，再去处理，会传入需要更新的数据的
        if (updateData.update_question) {
            questionUpdateSql = this.questionModel.updateData(updateData.questions, true);
        }
        Reflect.deleteProperty(updateData, 'questions')
        Reflect.deleteProperty(updateData, 'update_question')
        Reflect.deleteProperty(updateData, 'id')
        let cardUpdateSql = this.cardModel.update({
            set: updateData,
            where: {
                id: updateData.id
            }
        }, true);
        console.log(cardUpdateSql);
        console.log(questionUpdateSql);
        return true;
    }

    /**
     * @method deleteData 删除闪卡信息
     * @param {number} id 闪卡id 
     */
    async deleteData(id) {
        try {
            await this.cardModel.delete(id);
            return true;
        } catch (e) {
            throw e;
        }
    }

    /**
     * @method getData 获取闪卡信息
     * @param {string} type 类型
     * @param {*} options 查询数据
     */
    async getData(type, options) {
        if (type === 'info') {
            let returnData = await this.cardModel.getInfo(options.id);
            return returnData;
        }

        let returnData = await this.cardModel.getLearningCardList(options);
        let totalCount = await this.cardModel.getCount();

        return {
            data: returnData,
            tatol: totalCount
        }
    }
}

export default LearningCardService;