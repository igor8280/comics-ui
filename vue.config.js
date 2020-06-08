module.exports = {
	devServer: {
		proxy: {
			'/proxy': {
				target: 'http://localhost:9999',
				pathRewrite: {
					'/proxy': ''
				},
				changeOrigin: true,
				secure: false
			}
		}
	}
};
