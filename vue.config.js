const path = require('path')

module.exports = {
  devServer: {
    port: 8081,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BACKEND_TARGET,
        changeOrigin: true,
      }
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
      }
    },
  },
}