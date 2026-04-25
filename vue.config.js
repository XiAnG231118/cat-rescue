// vue.config.js
const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  publicPath: '/cat-rescue/',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
});