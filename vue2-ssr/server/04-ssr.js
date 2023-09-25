// nodejs代码
const express = require('express');
const fs = require('fs');
const path = require('path');
const {createBundleRenderer} = require("vue-server-renderer");

// 获取express实例
const server = express();

// 获取文件绝对路径
const resolve = dir => path.resolve(__dirname, dir)

// 第 1 步：开放dist/client目录，关闭默认下载index页的选项，不然到不了后面路由
server.use(express.static(resolve('../dist/client'), {index: false}))

// 获取渲染器
const bundle = resolve("../dist/server/vue-ssr-server-bundle.json");
const renderer = createBundleRenderer(bundle, {
  runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
  template: fs.readFileSync(resolve("../public/index.html"), "utf-8"), // 宿主文件
  clientManifest: require(resolve("../dist/client/vue-ssr-client-manifest.json")) // 客户端清单
})

// 编写路由处理不同url请求
server.get('*', (req, res) => {
  // 用渲染器渲染vue实例
  const context = {url: req.url};
  renderer.renderToString(context).then(html => {
    // console.log('html =>', html);
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
