module.exports = {
	devServer: {
		port: 8070
	},
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/sass/base/_variables.scss";
        `
      }
    }
  }
};