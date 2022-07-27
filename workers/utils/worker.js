import { isMainThread, parentPort, threadId, workerData } from "worker_threads";

if (isMainThread) {
    throw new Error('Its not a worker');
}

parentPort.on('message', ({ execFunc, options }) => {
    let argument = execFunc.match(/\(.*\)/mi)[0].replace('(', '').replace(')', '').split(',')
    let func = argument.length ? new Function(...argument, execFunc.slice(execFunc.match(/\{/mi).index)) : new Function(cb.slice(cb.match(/\{/mi).index));
    let result = func.apply({
        workerData,
        threadId
    }, options);
    parentPort.postMessage(result);
})