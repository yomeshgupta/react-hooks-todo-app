const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'source-map',
	entry: './src/index',
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css'
		})
	]
});
