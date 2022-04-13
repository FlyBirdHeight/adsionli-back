import Filter from "../../modules/filter";

class CommentNotifyFilter extends Filter {
    constructor(data) {
        super({
            template: [
                'notEmpty',
                'isString'
            ],
            address: [
                'notEmpty',
                'isString'
            ],
            data: [
                'notEmpty',
                'ObjEqual'
            ]
        }, data)
    }
}

export default CommentNotifyFilter;