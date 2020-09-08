module.exports = {
    chainWebpack: config => {
        config.plugin('html').tap(args => {
            args[0].template = './template/index.html'
            return args
        })
    }
}