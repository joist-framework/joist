module.exports = {
	files: ["*.html", "target/**", "../../packages/**/target/**"],
	server: {
		baseDir: "./",
		routes: {
			"/node_modules": "../../node_modules",
		},
	},
};
