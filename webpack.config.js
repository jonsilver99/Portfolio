const paths = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const $ = require('jquery')
// const UglifyJsPlugin  = require('uglifyjs-webpack-plugin')


module.exports = {
    entry: './src/modules/entry.js',

    output: {
        path: paths.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: "/build"
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader'
            },
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },

    plugins: [
        new ExtractTextPlugin("styles.css"),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            // Emitter: paths.resolve(__dirname, 'public/js/eventEmitter.js')
        })
        // new UglifyJsPlugin(),
    ],

    devServer: {
        // watchOptions: {
        //     aggregateTimeout: 300,
        //     poll: 1000
        // }
    }
};