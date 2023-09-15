const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    onBeforeSetupMiddleware(devServer) {
      devServer.app.get("/api/list", (req, res) => {
        res.json([
          { id: 1, name: "类型注解", selected: true },
          { id: 2, name: "编译型语言", selected: false },
        ]);
      });
    },
  },
})
