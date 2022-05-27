import Service from "../../../lib/service.js"
import Question from "../../../model/page/question.js";

class QuestionService extends Service {
    constructor() {
        super();
        this.questionModel = new Question();
    }

    /**
     * @method createQuestion 创建问题
     * @param {*} addData 等待添加问题
     */
    async createQuestion(addData) {
        try {
            let insertData = addData;
            if (Array.isArray(insertData)) {
                let connection = await this.questionModel.startAffair(true);
                try {
                    let insertMoreQuestionSql = await this.questionModel.insertMore(insertData, true);
                    await connection.query(insertMoreQuestionSql.sql, insertMoreQuestionSql.addData)

                    await connection.commit();
                    return true;
                } catch (e) {
                    console.log('insert more questions!', e);
                    await connection.rollback();
                    throw e;
                }
            } else {
                await this.questionModel.insert(insertData);
                return true;
            }
        } catch (e) {
            console.log('insert question!', e);
            throw e;
        }
    }

    /**
     * @method updateQuestion 更新问题
     * @param {*} updateDataList 更新问题内容
     */
    async updateQuestion(updateDataList) {
        if (Array.isArray(updateDataList)) {
            let connection = await this.questionModel.startAffair(true);
            try {
                let updateId = updateDataList.map(v => v.id);
                let updateData = updateDataList.map(v => {
                    Reflect.deleteProperty(v, 'id');
                    return v;
                })
                let updateSql = [];
                for (let i = 0; i < updateId.length; i++) {
                    updateSql.push(this.questionModel.update({
                        set: updateData[i],
                        where: {
                            id: updateId[i]
                        }
                    }, true))
                }
                
                updateSql = updateSql.map((v) => {
                    return connection.query(v.sql);
                })
                let status = await Promise.all(updateSql);
                await connection.commit();
            } catch (e) {
                console.log('update more question', e);
                await connection.rollback();
                throw e;
            }
        } else {
            try {
                let updateId = updateData.id;
                Reflect.deleteProperty(updateData, 'id');
                await this.questionModel.update({
                    set: updateData,
                    where: {
                        id: updateId
                    }
                })
                return true;
            } catch (e) {
                console.log('update question', e);
                throw e;
            }
        }
    }

    /**
     * @method deleteQuestion 删除问题
     * @param {number | number[]} responseData 等待删除数据
     */
    async deleteQuestion(responseData) {
        try {
            await this.questionModel.delete(responseData);
            
            return true;
        } catch (e) {
            console.log('delete question', e);
            throw e;
        }
    }
}

export default QuestionService