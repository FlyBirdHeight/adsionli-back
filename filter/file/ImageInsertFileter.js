import Filter from "../../modules/filter";


class ImageInsertFilter extends Filter {
    constructor(data) {
        super({
            path: [
                'notEmpty',
                'isString'
            ]
        }, data)
    }
}