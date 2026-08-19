const path = require("path");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");

const { loadBreakpoints } = require("./load-breakpoints");

const breakpoints = loadBreakpoints(path.resolve(__dirname, "breakpoints.json"));

const breakpointVariables = Object.entries(breakpoints)
  .map(([key, value]) => `$${key}: ${value};`)
  .join("\n");

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === "development";

  return {
    mode: argv.mode,
    entry: {
      "lucency-flexbox-grid-system": "./src/main.scss",
      "demo/demo": "./src/demo/styles/main.scss",
    },
    output: {
      path: path.resolve(__dirname, "dist"),
    },
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [["postcss-preset-env"]],
                },
              },
            },
            {
              loader: "sass-loader",
              options: {
                additionalData: (content, loaderContext) => {
                  const entry = path.resolve(__dirname, "src/main.scss");
                  if (loaderContext.resourcePath !== entry) {
                    return content;
                  }

                  return `${breakpointVariables}\n${content}`;
                },
              },
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
