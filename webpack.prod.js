const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	output: {
		filename: 'main.js'
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'main.css'
		}),
		new CleanWebpackPlugin()
	]
});
