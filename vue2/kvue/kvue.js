
function defineReactive(obj, key, val) {
    observe(val);
    Object.defineProperty(obj, key, {
        get() {
            console.log('get', key);
            return val;
        },
        set(v) {
            if (v !== val) {
                val = v;
                observe(v);
                console.log('set', key, val);
                // update(val);
            }
        },

    })
}

function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
}

class Kvue {
    constructor(options) {
        // 1.保存选项
        this.$options = options;
        this.$data = options.data;
        // 2.对data选项做响应式处理
        observe(this.$data);
        // 3.编译
    }
}