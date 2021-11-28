const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const  DonePlugin = require('./src/donePlugin')
const AutoExternalPlugin1 = require('./src/autoExternalPlugin')
module.exports = {
  mode:'development',
  entry:'./src/index.js',
  output:{
    filename:'bundle.js',
    path:path.resolve(__dirname,'dist')
  },
  plugins:[
    // new DonePlugin(),
    
    new AutoExternalPlugin1({
      lodash:{
        globalVariable:'_',
        url:'www.baidu.com' // cdn连接
      }
    }),
    new HtmlWebpackPlugin({
      template:'./public/index.html'
    }),
  ]
}