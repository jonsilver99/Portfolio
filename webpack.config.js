const paths = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
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
            // {
            //     test: /\.ejs$/,
            //     use: "ejs-compiled-loader",
            // },            
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                // use: ['style-loader', 'css-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(jpeg|jpg|png|gif|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        // name: '[path][name].[ext]'
                        publicPath: 'assets',
                        outputPath: 'assets',
                        name: '[name].[ext]',
                        emitFile: true
                    }
                }]
            }
        ]
    },

    plugins: [
        // new UglifyJsPlugin(),
        new ExtractTextPlugin("styles.css"),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jquery: 'jquery',
            emitter: paths.resolve(__dirname, 'src/modules/eventEmitter/eventEmitter.js'),
            cubeState: paths.resolve(__dirname, 'src/modules/cube/state.js'),
        }),
        new HtmlWebpackPlugin({
            // template:'./views/index.html'
            // template:'./src/views/index.ejs'
            template: '!!ejs-compiled-loader!./src/views/index.ejs',
        })
    ],

    devServer: {
        // watchOptions: {
        //     aggregateTimeout: 300,
        //     poll: 1000
        // }
        contentBase: paths.resolve(__dirname, "build/assets"),        
    }
};