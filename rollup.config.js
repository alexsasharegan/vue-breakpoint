export default {
	input: "lib/index.js",
	external: ["vue"],
	output: [
		{ file: "dist/index.esm.js", format: "es" },
		{
			file: "dist/index.js",
			format: "iife",
			name: "VueBreakpoint",
			globals: {
				vue: "Vue",
			},
		},
	],
};
