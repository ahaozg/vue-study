function defineReactive(obj, key, val) {
  observe(val);
  // 创建一个dep实例
  const dep = new Dep();
  Object.defineProperty(obj, key, {
    get() {
      console.log('get', key);
      // 依赖收集
      Dep.target && dep.addDep(Dep.target);
      return val;
    },
    set(v) {
      if (v !== val) {
        val = v;
        observe(v);
        console.log('set', key, val);
        // update();
        dep.notify();
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

function proxy(vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(val) {
        vm.$data[key] = val;
      }
    })
  })
}

class Kvue {
  constructor(options) {
    // 1.保存选项
    this.$options = options;
    this.$data = options.data;
    // 2.对data选项做响应式处理
    observe(this.$data);
    // 2.5代理
    proxy(this);
    // 3.编译
    new Compile(options.el, this);
  }
}

class Compile {
  constructor(el, vm) {
    // 保存Kvue实例
    this.$vm = vm;
    // 编译模板树
    this.compile(document.querySelector(el));
  }

  // el模板根节点
  compile(el) {
    // 遍历el
    // 1.获取el所有子节点
    el.childNodes.forEach(node => {
      if (node.nodeType === 1) {
        // 元素
        // console.log('element', node.nodeName);
        this.compileElement(node);
        // 继续递归
        if (node.childNodes.length > 0) {
          this.compile(node);
        }
      } else if (this.isInter(node)) {
        // 插值文本
        // console.log('text', node.textContent);
        this.compileText(node);
      }
    })
  }

  update(node, exp, dir) {
    // 初始化
    const fn = this[`${dir}Update`];
    fn && fn(node, this.$vm[exp]);
    // 更新
    new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val);
    })
  }

  // 处理插值文本
  compileText(node) {
    this.update(node, RegExp.$1, 'text');
  }

  // 编译element
  compileElement(node) {
    // 1.获取当前元素的所有属性，并判断他们是不是动态属性
    const nodeAttr = node.attributes;
    Array.from(nodeAttr).forEach(attr => {
      const attrName = attr.name;
      const exp = attr.value;
      // 判断attrName是否有指令
      if (attrName.startsWith('k-')) {
        // 指令
        // 截取k-后面的部分，特殊处理
        const dir = attrName.substring(2);
        // 判断是否存在指令处理函数，若存在，则调用
        this[dir] && this[dir](node, exp);
      }
      // 判断attrName是否有事件
      if (attrName.startsWith('@')) {
        // @click="onclick"
        const dir = attrName.substring(1);
        // 事件监听
        this.eventHandler(node, exp, dir);
      }
    })
  }

  // k-text
  text(node, exp) {
    this.update(node, exp, 'text');
  }

  textUpdate(node, val) {
    node.textContent = val;
  }

  // k-html
  html(node, exp) {
    this.update(node, exp, 'html');
  }

  htmlUpdate(node, val) {
    node.innerHTML = val;
  }

  // k-model
  model(node, exp) {
    // update方法只完成赋值和更新
    this.update(node, exp, 'model');
    // 事件监听
    node.addEventListener('input', e => {
      this.$vm[exp] = e.target.value;
    })
  }

  modelUpdate(node, val) {
    node.value = val;
  }

  // {{xxxx}}
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }

  eventHandler(node, exp, dir) {
    const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
    node.addEventListener(dir, fn.bind(this.$vm));
  }
}

// 负责具体更新任务的watcher
class Watcher {
  constructor(vm, key, updateFn) {
    this.$vm = vm;
    this.key = key;
    this.updateFn = updateFn;
    // 触发依赖收集
    Dep.target = this;
    vm[key];
    Dep.target = null;
  }

  update() {
    this.updateFn.call(this.$vm, this.$vm[this.key]);
  }
}

// 和data中响应式的key之间是一一对应关系
class Dep {
  constructor() {
    this.deps = [];
  }

  addDep(dep) {
    this.deps.push(dep);
  }

  notify() {
    this.deps.forEach(dep => dep.update());
  }
}