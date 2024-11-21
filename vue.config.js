const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const path = require('path-browserify');
const crypto = require('crypto-browserify');
const stream = require('stream-browserify');
const util = require('util');
const { URL } = require('url');



module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    host: '0.0.0.0', // Allow access from any IP address
    port: 8080,      // Set the port for the development server
    headers: {
      'Access-Control-Allow-Origin': '*', // Optional: allows CORS requests
    },
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
      }),
    ],
    externals: {
      jquery: 'jQuery',
    },
    resolve: {
      fallback: {
        zlib: require.resolve('browserify-zlib'),
        querystring: require.resolve('querystring-es3'),
        path: require.resolve('path-browserify'),
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        util: require.resolve('util/'),
        url: require.resolve('url/'),
      },
    },
  },
});
