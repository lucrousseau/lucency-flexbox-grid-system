const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    mode: argv.mode,
    entry: {
      "lucency-flex-grid": "./src/main.scss",
      "demo/demo": "./src/demo/styles/main.scss",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "sass-loader",
            },
          ],
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin(),
      new RemoveEmptyScriptsPlugin(),
      new HtmlWebpackPlugin({
        template: "./src/demo/index.html",
        filename: "demo/index.html",
        chunks: ["demo/demo"],
        inject: false,
      }),
    ],
    optimization: {
      minimizer: [new CssMinimizerPlugin()],
    },
    watch: isDevelopment,
  };
};
