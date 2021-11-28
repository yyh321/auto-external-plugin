const { ExternalModule } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
class AutoExternalPlugin1 {
  constructor(options){
    this.options = options
    this.externalModules = Object.keys(this.options) // 自动外链的模块key
    this.importedModules = new Set() // 实际用到的外部依赖模块
  }
  apply(compiler) {
    // 每种模块对应一个模块工厂，普通模块对应普通模块工测
    compiler.hooks.normalModuleFactory.tap('AutoExternalPlugin1',(normalModuleFactory) => {
      // 普通的js文件对应的钩子就是'javascript/auto'
      normalModuleFactory.hooks.parser.for('javascript/auto').tap('AutoExternalPlugin',parser=>{
        // console.log('parser = ',JSON.stringify(parser.hooks.call,null,2));
        // import 方式导入
        parser.hooks.import.tap('AutoExternalPlugin1',(statement,source) => {
          if(this.externalModules.includes(source)) {
            this.importedModules.add(source)
          }
        })
        // require 方式导入
        parser.hooks.call.for('require').tap('AutoExternalPlugin1',(expression) => {
          let value = expression.arguments[0].value
          if(this.externalModules.includes(value)) {
            this.importedModules.add(value)
          }
        })

      })
      
      // 改造模块生产过程，如果是外链模块，直接生成一个外链模块返回
      normalModuleFactory.hooks.factorize.tapAsync('AutoExternalPlugin1',(resolveData,cb) =>{
        let {request} = resolveData
        console.log('request = ',request)
        if(this.externalModules.includes(request)) {
          let {globalVariable} = this.options[request]
          cb(null,new ExternalModule(globalVariable))
        } else {
          cb(null) // 如果是正常模块，走正常打包模块流程
        }
      })
    })

    // 往输出的HTML种添加一个新的script标签，CDN链接
    compiler.hooks.compilation.tap('AutoExternalPlugin1',(compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('AutoExternalPlugin1',(htmlData,cb) => {
        console.log('data = ',htmlData.assetTags.scripts[0])
        Reflect.ownKeys(this.options).filter(key => this.importedModules.has(key)).forEach(key=>{
          htmlData.assetTags.scripts.unshift({
            tagName: 'script',
            voidTag: false,
            attributes: { defer: true,  src: this.options[key].url }
          })
        })
        cb(null,htmlData)
      })
    })

  }
}

module.exports = AutoExternalPlugin1