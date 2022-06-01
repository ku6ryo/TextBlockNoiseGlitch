const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

const buildMode = process.env.NODE_ENV === "production" ? "production" : "development"

module.exports = {
  mode: buildMode,
  entry: "./src/index.tsx",
  output: {
    path: `${__dirname}/dist`,
    filename: "[contenthash].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader"
      },
      {
        test: /\.(png|jpe?g|gif|mp4|glb|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(vert|frag)$/,
        exclude: /node_modules/,
        use: [
          'raw-loader',
        ]
      },
      {
        test: /\.scss$/,
        use: ["style-loader", {
          loader: "css-loader",
          options: {
            modules: true,
          },
        }, "sass-loader"],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/index.html"),
      filename: "index.html",
    })
  ],
  devServer: {
    compress: false,
    port: 3000,
  },
};