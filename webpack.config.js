const { join } = require("path");
// const MinifyPlugin = require("babel-minify-webpack-plugin");

const PROD = process.env.NODE_ENV == "production";
const plugins = [];

// if (PROD) {
// 	plugins.push(
// 		new MinifyPlugin({
// 			sourceMap: "source-map",
// 		})
// 	);
// }

module.exports = {
	entry: join(__dirname, "src/index.ts"),
	output: {
		path: join(__dirname, "lib"),
		filename: "index.js",
		libraryTarget: "commonjs2",
	},
	externals: {
		vue: {
			root: "Vue",
			commonjs2: "vue",
		},
	},
	resolve: {
		modules: ["node_modules"],
		extensions: [".ts", ".js", ".vue"],
	},
	devtool: "source-map",
	plugins,
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
				exclude: ["node_modules"],
			},
			{
				test: /\.tsx?$/,
				exclude: ["node_modules"],
				use: [
					{
						loader: "ts-loader",
						options: {
							appendTsSuffixTo: [/\.vue$/],
						},
					},
				],
			},
		],
	},
};
