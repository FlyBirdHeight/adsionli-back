import Models from "../../lib/model";

class Category extends Models {
    constructor() {
        super('local', 'category', 'category', [
            'name', 'des', 'is_show', 'is_recommend', 'sort'
        ])
        this.structure = {
            id: null,
            name: "",
            desc: "",
            page_count: 0,
            is_show: true,
            is_recommend: true,
            sort: 99,
            created_at: '',
            updated_at: ''
        }
    }
}

export default Category;