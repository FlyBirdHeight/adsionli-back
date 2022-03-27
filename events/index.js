'use strict'
import glob from "glob";
import fs from "fs";
import Event from "../lib/Event.js"
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const eventHandle = new Event();

const getEvent = (path) => {
    let res = [];
    const fileList = glob.sync(`${path}/*`);
    for (let value of fileList) {
        const info = fs.statSync(value);
        if (info.isDirectory(value)) {
            res = res.concat(getEvent(value));
        } else if (info.isFile(value)) {
            let matchData = value.match(/.+\.event\.js$/gi)
            if (Array.isArray(matchData) && matchData.length != 0) {
                res.push(value)
            }
        }
    }

    return res;
}

const registerListener = (path) => {
    let eventList = getEvent(path);
    if (eventList.length != 0) {
        for (let event of eventList) {
            const filePath = event.replace(/\.[^.]*$/gi, '');
            let eo = require(filePath);
            for (let key of Reflect.ownKeys(eo)) {
                if (Array.isArray(eo[key])) {
                    eo[key].forEach(v => {
                        eventHandle.on(key, v)
                    })
                } else if (typeof eo[key] === 'function') {
                    eventHandle.on(key, eo[key])
                }
            }
        }
    }

    return eventHandle;
}

export {
    getEvent,
    registerListener
}
