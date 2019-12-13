const path = require('path');
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

function getCommonConfig() {
  return {
    entry: {
      css: './scss/material-dashboard.scss'
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
          ],
        }]
    },
    plugins: [
      new CleanWebpackPlugin({
        verbose: true
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css'
      })
    ]
  }
}

module.exports = (env, argv) => {
  const config = getCommonConfig();

  if (argv.mode === 'production') {
    config.output = {
      path: path.resolve(__dirname, 'dist'),
      filename: `[name].${env.version}.[contenthash].js`
    };
    config.devtool = 'inline-source-map';
    config.devServer = {
      contentBase: './dist',
      historyApiFallback: true,
      publicPath: '/'
    };
    config.optimization = {
      minimizer: [
        new TerserPlugin(), new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          styles: {
            name: `styles.${env.version}`,
            test: /\.((s[ac])|c)ss$/,
            chunks: 'all',
            enforce: true,
            // maxSize: 244000
          },
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            // chunks: 'all',
            enforce: true,
            maxSize: 244000
          }
        }
      }
    };
  }

  return config;
}
