const queue = [
    {
        routingKey: "mail",
        bindingKey: "mail_setting_daily",
        options: {
            durable: true,
            argument: {
                maxLength: 5000
            }
        }
    },
    {
        routingKey: "mail",
        bindingKey: "mail_setting_file",
        options: {
            durable: true,
            argument: {
                maxLength: 5000
            }
        }
    },
    {
        routingKey: "mail",
        bindingKey: "mail_setting_comment_notify",
        options: {
            durable: true,
            argument: {
                maxLength: 5000
            }
        }
    },
    {
        routingKey: "page",
        bindingKey: "page_update",
        options: {
            durable: true,
            argument: {
                maxLength: 50000
            }
        }
    },
    {
        routingKey: "daily",
        bindingKey: "daily_update",
        options: {
            durable: true,
            argument: {
                maxLength: 50000
            }
        }
    },
    {
        routingKey: "file",
        bindingKey: "file_update",
        options: {
            durable: true,
            argument: {
                maxLength: 50000
            }
        }
    }
]

const registerQueue = [];
const generateQueue = () => {
    for (let v of registerQueue) {
        queue = queue.concat(v);
    }
}

generateQueue();

export default queue;
