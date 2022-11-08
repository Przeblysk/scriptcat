/* eslint-disable import/no-extraneous-dependencies */
import merge from "webpack-merge";
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import CompressionPlugin from "compression-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import common from "./webpack.config";

const src = `${__dirname}/src`;
const dist = `${__dirname}/dist`;

common.entry = {
  content: `${src}/content.ts`,
  inject: `${src}/inject.ts`,
  "linter.worker": `${src}/linter.worker.ts`,
  "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
  "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker.js",
};

common.output = {
  path: `${dist}/ext/src`,
  filename: "[name].js",
  clean: false,
};

// 取消splitChunks
common.optimization = {};

// 移除插件
common.plugins = common.plugins!.filter(
  (plugin) =>
    !(
      plugin instanceof HtmlWebpackPlugin ||
      plugin instanceof CopyPlugin ||
      plugin instanceof CleanWebpackPlugin
    )
);

export default merge(common, {
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "../../report/bundle-analyzer.html",
    }),
    // firefox商店文件不能大于4M, 所以需要压缩
    new CompressionPlugin({
      test: /ts.worker.js/,
      deleteOriginalAssets: true,
    }),
  ],
});
