/**
 * NOTE: 生产者,用来更新文件中的相关内容,在定时器任务中处理,所处消息队列：file_update,所处交换机：file(direct)
 */
import Producer from "../produce";
class DailyUpdateProducer extends Producer {
    constructor(){
        super("DailyUpdate");
        this.sendInfo = {
            
        }
    }
}

export default DailyUpdateProducer;