export default function verifyUpdate(itemData) {
    const compare = (newItem, oldItem) => {
        for (let value of Reflect.ownKeys(newItem)) {
            if (typeof newItem[value] == 'object' && Reflect.ownKeys(newItem[value]).length != 0) {
                if (Reflect.ownKeys(newItem).length !== Reflect.ownKeys(oldItem).length) return true;
                if (compare(newItem[value], oldItem[value])) return true;
            } else {
                if (Array.isArray(newItem[value])) {
                    if (newItem[value].join(",") === oldItem[value].join(",")) {
                        return true;
                    }
                } else if (newItem[value] !== oldItem[value]) {
                    return true;
                } else {
                    continue
                }
            }
        }

        return false;
    }

    for (let item of itemData) {
        if (compare(item.newItem, item.oldItem)) {
            return true;
        }
    }

    return false;
}