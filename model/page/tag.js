import Models from "../../lib/model";

class Tag extends Models {
    constructor() {
        super('local', 'tag', 'tags')
        this.structure = {
            id: null,
            name: "",
            is_show: true,
            sort: 99,
            page_count: 0,
            created_at: '',
            updated_at: ''
        }
    }
}

export default Tag;