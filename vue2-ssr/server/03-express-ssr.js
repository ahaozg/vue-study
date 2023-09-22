// nodejs代码
const express = require('express');
const Vue = require("vue");
const {createRenderer} = require("vue-server-renderer");

const renderer = createRenderer()

// 获取express实例
const server = express();
// 编写路由处理不同url请求
server.get('/', (req, res) => {
  // 1.创建Vue实例
  const app = new Vue({
    template: `<div @click="onClick">{{msg}}</div>`,
    data() {
      return {msg: 'Hello World! SSR'}
    },
    methods: {
      // 不起作用
      onClick() {
        console.log('onClick', this.msg);
      }
    }
  })
  // 3.用渲染器渲染vue实例
  renderer.renderToString(app).then(html => {
    console.log('html =>', html);
    res.send(html);
  }).catch(err => {
    console.log('err =>', err);
    res.status(500);
    res.end('Internal Server Error, 500 !')
  })
});
// 监听端口
server.listen(80, () => {
  console.log('server running!');
});
