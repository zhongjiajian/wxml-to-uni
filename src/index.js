const { parse, stringify } = require('himalaya');
const fs = require('fs');
const path = require('path');
const conver = require('./conver.js');

const wtu = function (wxml) {
    const xmlJson = parse(wxml);
    const xmlJsonStr = JSON.stringify(xmlJson, null, 2);
    const converJson = conver(xmlJson);
    const converJsonStr = JSON.stringify(converJson, null, 2);
    fs.writeFile(path.resolve(__dirname, 'xmlJson.json'), xmlJsonStr, err => {
        if (err) console.log(err);
    });
    fs.writeFile(path.resolve(__dirname, 'converJson.json'), converJsonStr, err => {
        if (err) console.log(err);
    });
    return stringify(converJson);
};


module.exports = wtu;