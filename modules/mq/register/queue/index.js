const queue = [
    {
        exchangeName: "mail",
        queueName: "mail_setting_daily",
        options: {
            durable: true,
            argument: {
                maxLength: 5000
            }
        }
    },
    {
        exchangeName: "mail",
        queueName: "mail_setting_file",
        options: {
            durable: true,
            argument: {
                maxLength: 5000
            }
        }
    },
    {
        exchangeName: "mail",
        queueName: "mail_setting_comment_notify",
        options: {
            durable: true,
            argument: {
                maxLength: 5000
            }
        }
    },
    {
        exchangeName: "page",
        queueName: "page_update",
        options: {
            durable: true,
            argument: {
                maxLength: 50000
            }
        }
    },
    {
        exchangeName: "daily",
        queueName: "daily_update",
        options: {
            durable: true,
            argument: {
                maxLength: 50000
            }
        }
    },
    {
        exchangeName: "file",
        queueName: "file_update",
        options: {
            durable: true,
            argument: {
                maxLength: 50000
            }
        }
    }
]

export default queue;
