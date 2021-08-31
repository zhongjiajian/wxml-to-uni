## 微信小程序wxml模板转uni-app模板

## Usage
```
npm install -D wxml-to-uni
```

```
const fs = require('fs')
const path = require('path')
const wtu = require('wxml-to-uni')

const inputPath = path.resolve(__dirname, 'input.wxml')
const wxml = fs.readFileSync(inputPath, {
  encoding: 'utf8'
})
const uniml = wtu(wxml)
const outputPath = path.resolve(__dirname, 'output.xml')
fs.writeFile(outputPath, uniml, err => {
  if (err) console.log(err);
})
```
## --example--
### input.wxml
```
<view wx:if="{{isShow}}">
</view>
<view wx:elif="{{isShow}}">
</view>
<view wx:else>
</view>

<myInput
  model:value="{{inputValue}}"
  bindchange1="bindchange1"
  bind:change2="bindchange2"
  catchchange1="catchchange1"
  catch:change2="catchchange2"
/>

<view capture-bind:tap="captureBindTap" capture-catch:tap="captureCatchTap">capture</view>

<view wx:for="{{list}}" wx:key="id">
  <view
    wx:for="{{item.children}}"
    wx:key="*this"
    wx:for-item="ele"
    wx:for-index="eleIndex"
  >
    {{eleIndex}}:{{ele}}
  </view>
</view>

<view class='{{dataInfo.status == 2?"mulBtns":""}}'></view>

<view class="{{dataInfo.status == 2?'mulBtns':''}}"></view>

<view
  class='orderDetail hasFixedFooter {{dataInfo.status == 2?"mulBtns":""}}'
  style="font-size:16px;color:{{color}};"
  data-flag="flag"
>content
</view>

<button class="{{type}} {{disabled?'disabled':''}}">{{btnText}}</button>

```


### output.xml
```
<view v-if='isShow'>
</view>
<view v-else-if='isShow'>
</view>
<view wx:else>
</view>

<myinput 
  :value.sync='inputValue' 
  @change1='bindchange1' 
  @change2='bindchange2' 
  catchchange1='catchchange1' 
  catch:change2='catchchange2'
></myinput>

<view @tap.captrue='captureBindTap' @tap.captrue.stop='captureCatchTap'>capture</view>

<view v-for='(item,index) in list' :key='item.id'>
  <view v-for='(ele,eleIndex) in item.children' :key='ele'>
    {{eleIndex}}:{{ele}}
  </view>
</view>

<view :class='dataInfo.status == 2?"mulBtns":""'></view>

<view :class="dataInfo.status == 2?'mulBtns':''"></view>

<view 
  :class="'orderDetail hasFixedFooter ' + (dataInfo.status == 2?'mulBtns':'')" 
  :style="'font-size:16px;color:' + (color) + ';'" 
  data-flag='flag'
>content</view>

<button :class="(type) + ' ' + (disabled?'disabled':'')">{{btnText}}</button>

```