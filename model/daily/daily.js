import Models from "../../lib/model";

class Daily extends Models {
    constructor() {
        super('local', 'daily', 'dailys', [
            'start_time', 'end_time', 'type', 'target'
        ])
        this.defaultExtend = 7;
    }

    /**
     * @method updateStatus 更新日程状态
     * @param {{id: number[], type: string}} options 更新内容
     */
    updateStatus(options) {
        let updateInfo = {
            set: {},
            where: {
                id: options.id
            }
        };
        let today = this.dateFormat("yyyy-MM-dd", new Date());
        console.log(this.dateFormat("yyyy-MM-dd", new Date(today.split('-').forEach((v, i) => {
            if (i == 2) {
                v = Number(v) + this.defaultExtend
            }
        }))));

        // switch (options.type) {
        //     case 'overtime':
        //         updateInfo.set['status'] = 2;
        //         updateInfo.set['overtime_date'] = this.dateFormat("yyyy-MM-dd", new Date(today.split('-').forEach((v, i) => {
        //             if (i == 2) {
        //                 v = Number(v) + this.defaultExtend
        //             }
        //         })));
        //         break;
        //     case 'ending':
        //         updateInfo.set['status'] = 3;
        //         updateInfo.set['real_end_time'] = today;
        //         break;
        //     case 'confirm':
        //         updateInfo.set['status'] = 4;
        //         break;
        //     case 'running':
        //         updateInfo.set['status'] = 1;
        //         break;
        //     default:
        //         break;
        // }
        // return this.update(updateInfo);
    }
}

export default Daily;