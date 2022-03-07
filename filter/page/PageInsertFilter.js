import Filter from "../../modules/filter";

class PageInsertFilter extends Filter {
    constructor(data) {
        super({
            title: [
                'notEmpty',
                'isString'
            ],
            sub_title: [
                'notEmpty',
                'isString'
            ],
            description: [
                'notEmpty',
                'isString'
            ],
            body: [
                'notEmpty',
                'isString'
            ],
        }, data)
    }
}

export default PageInsertFilter;