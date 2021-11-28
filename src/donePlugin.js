const { Parser } = require("webpack");

class DonePlugin {
  constructor(options){
    this.options = options
  }
  apply(compiler){
    compiler.hooks.emit.tapAsync('DonePlugin',(compilation,cb) => {
      console.log(`compilation = ${compilation}`);
    })
    // compiler.hooks.normalModuleFactory.tap('DonePlugin',(normalModuleFactory) => {
    //   // console.log(`compilation====  ${normalModuleFactory.toString()}`);
    //   normalModuleFactory.hooks.parser.for('javascript/auto').tap('DonePlugin',parser=>{
    //     console.log('parser == ',JSON.stringify(parser,null,2))
    //     console.log(123)
    //     parser.hooks.import.tap('DonePlugin',(statement,source) => {
    //       // console.log('satement = ',statement)
    //       // console.log('source = ',source)
    //     })
    //   })
    // })
  }
}

module.exports = DonePlugin

