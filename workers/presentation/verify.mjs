export default function verifyUpdate(itemData) {
    const compare = (newData, oldData) => {
        for (let value of Reflect.ownKeys(newData)) {
            if (typeof newData[value] == 'object' && Reflect.ownKeys(newData[value]).length != 0) {
                if (Reflect.ownKeys(newData).length !== Reflect.ownKeys(oldData).length) return true;
                if (compare(newData[value], oldData[value])) return true;
            } else {
                if (Array.isArray(newData[value])) {
                    if (newData[value].join(",") === oldData[value].join(",")) {
                        return true;
                    }
                } else if (newData[value] !== oldData[value]) {
                    return true;
                } else {
                    continue
                }
            }
        }

        return false;
    }

    for (let item of itemData) {
        if (compare(item.newData, item.oldData)) {
            return true;
        }
    }

    return false;
}