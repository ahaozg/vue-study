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
    // 3.挂载
    if (options.el) {
      this.$mount(options.el);
    }
  }

  // 添加$mount
  $mount(el) {
    this.$el = document.querySelector(el);
    // 1.声明updateComponent
    const updateComponent = () => {
      // 真实dom方案
      // // 渲染获取视图结构
      // const nEl = this.$options.render.call(this);
      // // 结果追加
      // const parent = this.$el.parentElement;
      // parent.insertBefore(nEl, this.$el.nextSibling);
      // parent.removeChild(this.$el);
      // this.$el = nEl;

      // vnode方案
      const vnode = this.$options.render.call(this, this.$createElement);
      this._update(vnode);
    }
    // 2.new Watcher
    new Watcher(this, updateComponent);
  }

  // 返回vnode
  $createElement(tag, props, children) {
    return {
      tag,
      props,
      children
    }
  }

  // 接受vnode,返回dom
  _update(vnode) {
    const prevNode = this._vnode;
    if (!prevNode) {
      // init
      this.__patch__(this.$el, vnode);
    } else {
      // update:diff
      this.__patch__(prevNode, vnode);
    }
    this._vnode = vnode;
  }

  __patch__(oldVnode, vnode) {
    if (oldVnode.nodeType) {
      // init
      const parent = oldVnode.parentElement;
      const refElm = oldVnode.nextSibling;
      // 递归创建dom结构
      const el = this.createEle(vnode);
      parent.insertBefore(el, refElm);
      parent.removeChild(oldVnode);
    } else {
      // update
      const el = vnode.el = oldVnode.el;
      // diff
      // sameVnode
      if (oldVnode.tag === vnode.tag) {
        // todo: props
        // children
        const oldCh = oldVnode.children;
        const newCh = vnode.children;
        if (typeof newCh === 'string') {
          if (typeof oldCh === 'string') {
            // text update
            if (newCh !== oldCh) {
              el.textContent = newCh;
            }
          } else {
            el.textContent = newCh;
          }
        } else {
          if (typeof oldCh !== 'string') {
            // updateChildren
            this.updateChildren(el, oldCh, newCh);
          } else {
            // replace text with elements
            // 先清空
            el.textContent = '';
            // 再转换children
            // 再追加
            // todo：。。。
          }
        }
      } else {
        // replace
      }
    }
  }

  // 递归创建dom树
  createEle(vnode) {
    const el = document.createElement(vnode.tag);
    // todo: props
    // children
    if (vnode.children) {
      if (typeof vnode.children === 'string') {
        // text
        el.textContent = vnode.children;
      } else {
        // array children
        vnode.children.forEach(n => {
          const child = this.createEle(n);
          el.appendChild(child);
        })
      }
    }

    // 保存真实dom用于更新
    vnode.el = el;

    return el;
  }

  // 不优化，不考虑key
  updateChildren(parentElm, oldCh, newCh) {
    // 这里暂且直接patch对应索引1的两个节点
    const len = Math.min(oldCh.length, newCh.length);
    for (let i = 0; i < len; i++) {
      this.__patch__(oldCh[i], newCh[i]);
      // newCh若是更长的哪个，说明有新增
      if (newCh.length > oldCh.length) {
        newCh.slice(len).forEach((child) => {
          const el = this.createEle(child);
          parentElm.appendChild(el);
        });
      } else if (newCh.length < oldCh.length) {
        // oldCh若是更长的那个，说明有删减
        oldCh.slice(len).forEach((child) => {
          parentElm.removeChild(child.el);
        })
      }
    }
  }
}

// 负责具体更新任务的watcher
class Watcher {
  constructor(vm, updateFn) {
    this.$vm = vm;
    this.getter = updateFn;
    this.get();
  }

  get() {
    // 触发依赖收集
    Dep.target = this;
    this.getter.call(this.vm);
    Dep.target = null;
  }

  update() {
    this.get();
  }
}

// 和data中响应式的key之间是一一对应关系
class Dep {
  constructor() {
    this.deps = new Set();
  }

  addDep(dep) {
    this.deps.add(dep);
  }

  notify() {
    this.deps.forEach(dep => dep.update());
  }
}