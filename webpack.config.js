const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const webpack = require("webpack");
const path = require("path");
const globSync = require("glob").sync;

module.exports = (env, options) => ({
  entry: {
    home   : "./src/js/index.js",
  },
  devServer: {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "dist"),
    open: true,
    compress: true,
    // hot: true,
    port: 9000,
  },
  stats: {
    children: true,
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          options.mode !== "production"
            ? "style-loader"
            : {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: "../../",
                },
              },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 3,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [["autoprefixer"]],
              },
              sourceMap: true,
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
  
      {
        test: /\.(jpg|jpeg|gif|png|svg|webp)$/,
        exclude: path.resolve(__dirname, './src/sass'),
        use: [
          {
            loader: 'file-loader',
            options: {
              limit: 8192,
              name: 'assets/images/[name].[hash:8].[ext]',
              useRelativePaths: true,
              context: path.resolve(__dirname, "src/images"),
              fallback: 'url-loader',
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: false,
                quality: 45
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: true,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: true,
                optimizationLevel: 3
              },
              // the webp option will enable WEBP
              webp: {
                quality: 20
              }
            }
          },
        ],
      },
      /*
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      */
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: false
            }
          }
        ]
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/css/[contenthash].css",
    }),
    new CleanWebpackPlugin(),

    new HtmlWebpackPlugin({
      //favicon: './src/images/favicon.png',
      inject: true,
      chunks: ['common', 'home'],
      template: './src/index.html',
      filename: 'index.html'
    }),
    
    // ...globSync("src/**/*.html").map((fileName) => {
    //   console.log(fileName);

    //   return new HtmlWebpackPlugin({
    //     favicon: './src/images/favicon.png',
    //     template: fileName,
    //     inject: true,
    //     filename: fileName.replace("src/", ""),
        
    //   });
    // }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery", "window.jQuery": "jquery",
      Popper: ["popper.js", "default"],
      Util: "exports-loader?Util!bootstrap/js/dist/util",
      Dropdown: "exports-loader?Dropdown!bootstrap/js/dist/dropdown",
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
      new CompressionPlugin({
        test: /\.js$|\.css(\?.*)?$/i,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  output: {
    filename: "assets/js/[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
    publicPath: '',
  },
});
