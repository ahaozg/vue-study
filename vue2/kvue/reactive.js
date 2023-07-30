// 1. 实现响应式
// vue2:Object.defineProperty(obj, key, desc)
// vue3: new Proxy()
// 设置obj的key，拦截它，初始值val
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

function set(obj, key, val) {
    defineReactive(obj, key, val);
}

function observe(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
}

const obj = {
    foo: 'foo',
    bar: 'bar',
    baz: {
        a: 1
    },
    arr: [1, 2, 3],
};
// 对obj进行响应式处理
observe(obj);
// defineReactive(obj, 'foo', ' foooooo');
obj.foo; // get
obj.foo = '111'; // set
obj.bar; // get
obj.bar = '222'; // set
obj.baz; // get
obj.baz.a = 'aaa'; // set
obj.baz = {
    a: 10
}
obj.baz.a = '10aaa';
obj.doo = 'doo';
obj.doo;
set(obj, 'doo', 'doo');
obj.doo = 'doo1';
obj.doo;

// 数组  重写数组的7个方法实现拦截  push pop shift unshift sort splice reverse
obj.arr[0];
obj.arr[0] = 2;
obj.arr.push(4);
