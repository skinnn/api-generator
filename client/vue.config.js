module.exports = {
	devServer: {
		port: 8070
	},
	css: {
		loaderOptions: {
			sass: {
				prependData: `
          @use "@/sass/base/_variables.scss" as *;
        `
			}
		}
	}
};
