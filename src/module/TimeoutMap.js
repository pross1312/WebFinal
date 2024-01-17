class TimeoutError extends Error {
    constructor(msg) {
        super(msg);
    }
}
class TimeoutMap {
    constructor() {
        this.data = {};
    }
    put(key, obj, timeout) {
        if (!key) throw new Error("Invalid key");
        if (this.data[key] !== undefined) {
            const obj = this.data[key];
            if (!(obj instanceof TimeoutError)) {
                const [_, timeout] = obj;
                clearTimeout(timeout);
            }
        }
        this.data[key] = [obj, setTimeout(() => {
            this.data[key] = new TimeoutError("Time out");
        }, timeout)];
    }
    get(key) {
        const obj = this.data[key];
        if (obj === undefined) return null;
        else if (obj instanceof TimeoutError) {
            delete this.data[key];
            throw obj;
        } else {
            const [data, timeout] = obj;
            return data;
        }
    }
    pop(key) {
        const obj = this.data[key];
        if (obj === undefined) return null;
        else if (obj instanceof TimeoutError) {
            delete this.data[key];
            throw obj;
        } else {
            const [data, timeout] = obj;
            clearTimeout(timeout);
            delete this.data[key];
            return data;
        }
    }
}
module.exports = {
    TimeoutError,
    TimeoutMap,
};
