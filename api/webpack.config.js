const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const sls = require('serverless-webpack');

// plugins
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  target: 'node',
  entry: sls.lib.entries,
  context: sls.lib.serverless.config.servicePath,
  mode: sls.lib.webpack.isLocal ? 'development' : 'production',
  devtool: sls.lib.webpack.isLocal ? 'eval-cheap-source-map' : undefined,
  externals: getExternals(),
  resolve: {
    extensions: ['.js', '.ts', '.json'],
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          transpileOnly: true,
          onlyCompileBundledFiles: true,
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        files: './src/**/*.{ts,js}',
      },
    }),

    /**
     * Hide warnings for these packages belows, these packages usually have
     * some crazy dynamic requires insider their code, therefore webpack
     * doesn't know exactly what to import
     */
    new webpack.ContextReplacementPlugin(/express/),
    new webpack.ContextReplacementPlugin(/require_optional/),
  ],
};

/**
 * In local development, we exclude the bundling of modules coming from node_modules
 * therefore making the build faster while we are developing, for production we want
 * to bundle everything to making the final output suitable for the lambda size limit.
 *
 * It excludes both local app node_modules and the root node_modules
 */
function getExternals() {
  if (sls.lib.webpack.isLocal) {
    return nodeExternals();
  }
}
