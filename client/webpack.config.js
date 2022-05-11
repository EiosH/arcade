const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const APP_ENTRY = "./src/index.ts";

const defaultWebpackConfig = {
  mode: "development",
  entry: {
    app: [APP_ENTRY],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "output/resource/"),
    // publicPath: "/resource/",
  },
  devServer: {
    open: true,
    // proxy: proxyConfig,
  },
  plugins: [
    // new webpack.DefinePlugin(project.globals),
    new HtmlWebpackPlugin({
      title: "arcade",
      env: process.env.NODE_ENV || "development",
      template: path.resolve(__dirname, "src/index.html"),
      // favicon: './src/public/favicon.ico',
      hash: false,
      // employeeConf: project.html_employee,
      filename: "index.html",
      inject: "body",
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeAttributeQuotes: true,
      },
    }),
    // new CopyWebpackPlugin([
    //   { from: path.resolve(__dirname, "src/public"), to: path.resolve(__dirname, "output/resource/") },
    // ]),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
};

module.exports = defaultWebpackConfig;
