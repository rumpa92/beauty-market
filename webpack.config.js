const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const webpack = require('webpack');

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'assets/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      'process.env.VUE_APP_MODE': JSON.stringify(process.env.VUE_APP_MODE || 'development'),
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false
    })
  ],
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.vue', '.json']
  },
  devServer: {
    port: 8080,
    hot: true,
    open: true,
    historyApiFallback: true,
    client: {
      logging: 'error',
      overlay: {
        errors: true,
        warnings: false,
        runtimeErrors: true
      },
      progress: false,
      reconnect: true
    },
    onListening: function(devServer) {
      // Safely handle different invocation signatures of onListening.
      try {
        if (devServer && devServer.server && typeof devServer.server.address === 'function') {
          const addr = devServer.server.address();
          const port = addr && addr.port ? addr.port : (devServer.options && devServer.options.port) || process.env.PORT;
          console.log('Dev server listening on port:', port);
        } else if (devServer && devServer.options && devServer.options.port) {
          console.log('Dev server listening on port:', devServer.options.port);
        } else if (process.env.PORT) {
          console.log('Dev server listening on port:', process.env.PORT);
        } else {
          // Avoid logging raw Event objects which results in '[object Event]'
          console.log('Dev server is listening');
        }
      } catch (err) {
        // Log a concise error without printing event objects to the client overlay
        console.warn('onListening handler error:', err && err.message ? err.message : err);
      }
    }
  }
};
