"use strict";
const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const CompressionPlugin = require("compression-webpack-plugin");

const name = "cesium-hot-update-template"; // 网页标题

const port = 80; // 端口

// vue.config.js 配置说明
//官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  publicPath: "/",
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: "dist",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: "static",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  parallel: false, // 打包报错，先把多线程构建的时候给关掉
  // webpack-dev-server 相关配置
  devServer: {
    host: "0.0.0.0",
    port: port,
    open: true,
    disableHostCheck: true,
  },
  css: {
    loaderOptions: {
      sass: {
        sassOptions: { outputStyle: "expanded" },
      },
    },
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        "@": resolve("src"),
        "@cesium": resolve("src/cesiumSource/packages"),
      },
    },
    plugins: [
      // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
      new CompressionPlugin({
        cache: false, // 不启用文件缓存
        test: /\.(js|css|html)?$/i, // 压缩文件格式
        filename: "[path].gz[query]", // 压缩后的文件名
        algorithm: "gzip", // 使用gzip压缩
        minRatio: 0.8, // 压缩率小于1才会压缩
      }),
      // TODO 配置全局对象CESIUM_BASE_URL by weiPeng
      new webpack.DefinePlugin({
        CESIUM_BASE_URL: JSON.stringify("/cesiumAssets"),
      }),
    ],
  },
  chainWebpack(config) {
    config.plugins.delete("preload"); // TODO: need test
    config.plugins.delete("prefetch"); // TODO: need test

    // TODO 配置glsl加载器 by weiPeng
    config.module
      .rule("glsl")
      .test(/\.glsl$/)
      .use("webpack-glsl-loader")
      .loader("webpack-glsl-loader");

    // TODO 配置mjs加载器 by weiPeng
    config.module
      .rule("mjs")
      .test(/\.mjs$/)
      .type("javascript/auto")
      .include.add(resolve("node_modules"))
      .end();

    // TODO 配置import.meta加载器 by weiPeng
    config.module
      .rule("js")
      .test(/\.js$/)
      .use("@open-wc/webpack-import-meta-loader")
      .loader("@open-wc/webpack-import-meta-loader");

    // TODO 解决Cesium链接加载警告 by weiPeng
    config.module.set("unknownContextRegExp", /^('|')\.\/.*?\1$/);
    config.module.set("unknownContextCritical", false);
    config.amd({
      toUrlUndefined: true,
    });
  },

  // TODO Babel配置需要转换的依赖 by weiPeng
  transpileDependencies: [
    /[/\\]node_modules[/\\]@cesium[/\\]/,
    /[/\\]node_modules[/\\]cesium[/\\]/,
  ],
};
