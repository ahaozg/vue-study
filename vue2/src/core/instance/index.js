import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// Vue构造函数
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 初始化
  this._init(options)
}

// 下面几个函数用于扩展一些Vue实例方法和属性
initMixin(Vue) // _init
stateMixin(Vue) // $set $get $watch
eventsMixin(Vue) //  $on $once $off $emit
lifecycleMixin(Vue) // $destroy $forceUpdate
renderMixin(Vue) // $nextTick _render

export default Vue
