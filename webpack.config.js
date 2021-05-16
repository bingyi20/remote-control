const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: {
        home: path.join(__dirname, './renderer/home/main.js'),
        control: path.join(__dirname, './renderer/control/main.js')
    },
    target: 'electron-renderer',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
    },
    module: {
        rules: [
            {test: /\.js$/, use: ['babel-loader']},
            {test: /\.vue$/, use: ['vue-loader']},
            {test: /\.scss$/, use: ['style-loader', 'css-loader', 'sass-loader']},
        ]
    },
    devServer: {
        port: 9999,
        hot: true
    },
    mode: 'development',
    devtool: 'source-map',
    resolve:{
        extensions: ['.js', '.json', '.vue']
    },
    plugins: [
        new CleanWebpackPlugin(),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html'),
            chunks: ['home'],
            filename: 'home.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './public/index.html'),
            chunks: ['control'],
            filename: 'control.html'
        })
    ]
}