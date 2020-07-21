const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
console.log('isDev', isDev);

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
    'css-loader',
  ];

  if (!!loader) {
    loaders.push(loader);
  }

  return loaders;
};


module.exports = {
  // context: - говорит где лежат все исходники приложения
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    // entry: - указываем точки входа
    main: './index.js',
    analytics: './analytics.js'
  },
  output: {
    // output: - указываем куда складываем результат
    // [name].bundle.js => [name] будет заменен указанной точкой входа (main, analytics и т.д.)
    // [contenthash] - позволяющий добавить hash к файлу
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    // в extensions: указываем webpack какие расширения должен понимать по умолчанию
    extensions: ['.js'],
    alias: {
      '@app': path.resolve(__dirname, 'src/app'),
      '@': path.resolve(__dirname, 'src'),
    }
  },
  optimization: optimization(),
  devServer: {
    port: 4500,
    hot: isDev,
    watchContentBase: isDev,
    liveReload: isDev,
    overlay: isDev,
    // http2: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      // title: - работает только если нет template:
      // title: 'Webpack Title From HTMLWebpackPlugin\'s settings',
      template: './index.html',
      minify: {
        // collapseWhitespace - оптимизация html в prod режиме
        collapseWhitespace: isProd,
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    new MiniCssWebpackPlugin({
      filename: filename('css'),
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        // 'style-loader' - добавляет стили в head
        // use: ['style-loader', 'css-loader']
        use: cssLoader()
      },
      {
        test: /\.less$/,
        use: cssLoader('less-loader')
      },
      {
        test: /\.(sass|scss)$/,
        use: cssLoader('sass-loader')
      },
      {
        test: /\.(png|jpg|jpeg|svg|gif)$/,
        use: ['file-loader']
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
      }
    ]
  }
}
