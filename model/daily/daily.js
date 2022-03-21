import Models from "../../lib/model";

class Daily extends Models {
    constructor() {
        super('local', 'daily', 'dailys', [
            'start_time', 'end_time', 'type', 'target'
        ])
    }
}

export default Daily;