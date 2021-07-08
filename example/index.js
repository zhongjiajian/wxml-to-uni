const  fs  =  require('fs')
const  path  =  require('path')
const wtu = require('../src')
// const wtu = require('../lib')
const inputPath = path.resolve(__dirname,'input/1.wxml')
const wxml = fs.readFileSync(inputPath, {encoding: 'utf8'})
const uniml = wtu(wxml)
const outputPath = inputPath.replace('input','output')
fs.writeFile(outputPath,uniml,err=>{
    if(err) console.log(err);
})
console.log('👉')
console.log(uniml)
console.log('end')