const webpack = require('webpack');
// этот файл - инструмент сборки
const path  = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');                             // работай с html
const { CleanWebpackPlugin } = require('clean-webpack-plugin');                       // очистка кеша
const CopyWebpackPlugin = require('copy-webpack-plugin');                             // копируй-перетаскивай
const MiniCssExtractPlugin = require('mini-css-extract-plugin');                      // работай с css (вставляй стили в файл css)
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // минифицируй css
const TerserWebpackPlugin = require('terser-webpack-plugin');                         // минифицируй js
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');          // через него прикрутить externals с массивом объектов, содержащих урлы с cdn библтотек
const Dotenv = require('dotenv-webpack');

const isDev = process.env.NODE_ENV === 'development' // определяй в каком сейчас режиме
const isProd = !isDev                                //

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    }
  }

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsWebpackPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders  = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {},
    },
    'css-modules-typescript-loader?modules',
    'css-loader',
    // 'postcss-loader',
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            [
              'autoprefixer',
              {
                // Options
              },
            ],
          ],
        },
      }
    }
  ] // свой style-loader в комплекте

  if (extra) {
    loaders.push(extra)
  }

  return loaders
}

// const babelOptions = (preset) => {
//   const opts = {
//     presets: ["@babel/preset-env", "@babel/preset-react"],
//     plugins: [
//       '@babel/plugin-proposal-class-properties'
//     ]
//   }

//   if (preset) {
//     opts.presets.push(preset)
//   }

//   return opts
// }

// const jsLoaders = () => {
//   const loaders = [
//     {
//       loader: 'babel-loader',
//       options: babelOptions(),
//     }
//   ]

//   return loaders;
// }

const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      title: 'Web',
      environment: process.env.NODE_ENV,
      filename: 'index.html',
      template: './template/index.html',
      // baseUrl: process.env.NODE_ENV === 'development'? '/' : '/costs-control/',
      minify: {
        collapseWhitespace: !isProd
      },
      inject: true,
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.resolve(__dirname, './src/images/**/*').replace(/\\/g, "/"), // в win пути с другими слэшами,
    //       to: path.resolve(__dirname, './dist/assets/'),
    //     },
    //   ]
    // }),
    new MiniCssExtractPlugin({
      filename: 'assets/css/' + filename('css'),
    }),
    // new Dotenv(),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: "material-icons",
    //       entry: "https://fonts.googleapis.com/icon?family=Material+Icons",
    //       global: "material-icons",
    //     }
    //   ]
    // }),
  ];

  return base;
}

//
module.exports = {
  context: path.resolve(__dirname, 'src'), // со всех путях  удаляю эту папку
  mode: 'development',
  entry: {                                        // точка входа в приложение, откуда начать
    main: ['./index.tsx'],
  },
  output: {                                       // куда складывать результаты работы
    filename: 'assets/js/' + filename('js'),      // итоговый файл, после сборкивсех js файлов
    chunkFilename: 'assets/js/' + filename('chunk.js'),
    path: path.resolve(__dirname, 'dist'), // отталкиваясь от текущей директории, складывать все в dist
    publicPath: '/',                              // относительная ссылка, которая будет подставляться из браузера
  },
  resolve: {
    extensions: [                                 // какие расширения нужно понимать по умолчанию
      '.js', '.jsx', '.json', '.ts', '.tsx'
    ],
    alias: {                                      // путь до корня проекта
      '@': path.resolve(__dirname, 'src')
    }
  },
  optimization: optimization(),
  devServer: {
    client: {
      logging: 'info',
      overlay: true,                              // вывод ошибок на экранб в браузер
    },
    open: true,
    port: 4200,
    hot: isDev,                                   // если разработка - true
    historyApiFallback: true,                     // отдаем по любому url главный html файл - index.html
    // proxy: {
    //   '/api': 'http://localhost:7000',
    // }
  },
  devtool: isDev ? 'source-map' : 'eval',
  externals: {},
  plugins: plugins(),
  module: {
    rules: [
        {
          test: /\.[tj]sx?$/,
          use: ['ts-loader'],
        },
        {
            test: /\.css$/,
            use: cssLoaders()
        },
        {
            test: /\.s[ac]ss$/,
            use: cssLoaders('sass-loader')
        },
        {
            test: /\.(png|jpg|jpeg|svg|gif)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                },
            ]
        },
        {
            test: /\.(pdf|txt|doc|docx)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                }
            ]
        },
        {
            test: /\.(ttf|woff|woff2|eot)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    }
                }
            ]
        },
        {
            test: /\.json$/,
            use: [
                'json-loader',
            ],
            type: 'javascript/auto'
        },
        // {
        //     test: /\.(js|jsx)$/,
        //     exclude: /node_modules/,
        //     use: jsLoaders()
        // },
        {
            test: /\.html$/,
            // include: path.resolve(__dirname, 'src/template'),
            use: [
              'raw-loader',
            ]
        },
    ]
  },
  stats: {
    colors: true,
    reasons: true,
  }
}