const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const PATH = {
  root: './',
  src: path.resolve(__dirname, 'src'),
  app: path.resolve(__dirname, 'src/app'),
  dist: path.resolve(__dirname, 'dist'),
  favicon: path.resolve(__dirname, `src/favicon.ico`),
  assets: path.resolve(__dirname, `src/assets`)
};

const MODE = {
  dev: 'development',
};
const isDev = process.env.NODE_ENV === MODE.dev;
const isProd = !isDev;

console.log('isDev:', isDev);

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    }
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ];
  }

  return config;
};
const filename = (ext) => {
  let result = `[name].[hash].${ext}`;

  if (isDev) {
    result = `[name].${ext}`;
  }

  return result;
};
const cssLoader = (loader) => {
  const loaders = [
    {
      loader: MiniCssWebpackPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
      }
    },
    {
      loader: 'css-loader',
      options: { sourceMap: true },
    }
  ];

  if (!!loader) {
    loaders.push({
      loader: loader,
      options: { sourceMap: true },
    });
  }

  return loaders;
};
const devServerOverlay = (isDev) => {
  if (isDev) {
    return {
      warnings: true,
      errors: true,
    };
  } else {
    return false;
  }
};


module.exports = {
  // context: - говорит где лежат все исходники приложения
  context: PATH.src,
  mode: MODE.dev,
  entry: {
    // entry: - указываем точки входа
    main: [
      '@babel/polyfill',
      `${PATH.root}index.js`
    ],
    analytics: `${PATH.root}analytics.js`
  },
  output: {
    // output: - указываем куда складываем результат
    // [name].bundle.js => [name] будет заменен указанной точкой входа (main, analytics и т.д.)
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // в extensions: указываем webpack какие расширения должен понимать по умолчанию
    extensions: ['.js'],
    alias: {
      '@app': PATH.app,
      '@': PATH.src,
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4500,
    hot: isDev,
    watchContentBase: isDev,
    liveReload: isDev,
    overlay: devServerOverlay(isDev),
    // http2: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      // title: - работает только если нет template:
      // title: 'Webpack Title From HTMLWebpackPlugin\'s settings',
      template: `${PATH.root}index.html`,
      minify: {
        // collapseWhitespace - оптимизация html в prod режиме
        collapseWhitespace: isProd,
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: `${PATH.assets}`,
          to: `${PATH.dist}/assets/`
        },
        {
          from: PATH.favicon,
          to: PATH.dist
        },
      ]
    }),
    new MiniCssWebpackPlugin({
      filename: filename('css'),
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
      module: isDev,
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
            ],
          }
        }
      },
      {
        test: /\.css$/,
        // 'style-loader' - добавляет стили в head
        // use: ['style-loader', 'css-loader']
        use: cssLoader(),
      },
      {
        test: /\.less$/,
        use: cssLoader('less-loader'),
      },
      {
        test: /\.(sass|scss)$/,
        use: cssLoader('sass-loader'),
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
          }
        }
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader']
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      },
    ]
  }
}
