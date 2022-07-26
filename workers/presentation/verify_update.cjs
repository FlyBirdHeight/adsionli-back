const { Worker, MessageChannel, isMainThread, parentPort, threadId, workerData } = require('worker_threads');


if (!isMainThread) {
    parentPort.once('message', ({ uPort, data }) => {
        console.log(`我是${threadId}号线程， 下面是我收到的数据:`)
        uPort.once('message', (msg) => {
            console.log(msg);
        })
        data[0] += 1;
        uPort.postMessage(`${threadId}向其他线程发送消息啦！`)
        if (data[0] >= workerData.count) {
            parentPort.postMessage(`这里是${threadId}线程，更新判断执行已完成`)
        }
    })


} else {
    const worker1 = new Worker("./workers/presentation/verify_update.cjs", {
        workerData: {
            name: "进程1",
            data: {
                item: "text"
            },
            count: 2
        }
    });
    const worker2 = new Worker("./workers/presentation/verify_update.cjs", {
        workerData: {
            name: "进程2",
            data: {
                item: "text"
            },
            count: 2
        }
    });
    let handleCount = new Uint8Array(new SharedArrayBuffer(1))

    //NOTE: 创建消息通道，用于1,2两个线程进行通信
    const { port1, port2 } = new MessageChannel();
    worker1.postMessage({ uPort: port1, data: handleCount }, [port1]);
    worker2.postMessage({ uPort: port2, data: handleCount }, [port2]);
    // console.log(port1, port2)
    //README: 下面是主进程收到消息
    worker1.once('message', (data) => {
        console.log('main：', worker1.threadId, data)
    })

    worker2.once('message', (data) => {
        console.log('main：', worker2.threadId, data)
    })

}