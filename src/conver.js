const isEvent = str => {
    str = str.toString();
    return str.startsWith('bind') || str.startsWith('catch') || str.startsWith('capture-bind:') || str.startsWith('capture-catch:');
};
const isIf = str => {
    str = str.toString();
    return str === "wx:if" || str === "wx:elif" || str === "wx:else";
};
const isFor = str => {
    str = str.toString();
    return str === "wx:for" || str === "wx:for-item" || str === "wx:for-index" || str === "wx:key";
};
const isModel = str => {
    str = str.toString();
    return str.startsWith('model:');
};

const eventKeyConver = str => {
    if (str.startsWith('bind:')) return str.replace('bind:', '@');
    else if (str.startsWith('bind')) return str.replace('bind', '@');
    else if (str.startsWith('capture-bind:')) return str.replace('capture-bind:', '@') + '.captrue';
    else if (str.startsWith('capture-catch:')) return str.replace('capture-catch:', '@') + '.captrue.stop';
    return str;
};

const ifKeyConver = str => {
    if (str === 'wx:if') return 'v-if';
    else if (str === 'wx:elif') return 'v-else-if';
    else if (str === 'wx:else') return 'v-else';
};

const modelKeyConver = str => {
    return str.replace('model', '') + '.sync';
};

const forConver = children => {
    let loopMain, loopKey, loopItem, loopindex;
    children.forEach((item, index) => {
        if (item.key === 'wx:for') loopMain = item;
        else if (item.key === 'wx:key') loopKey = item;
        else if (item.key === 'wx:for-item') {
            loopItem = item;
            children[index] = null;
        }
        else if (item.key === 'wx:for-index') {
            loopindex = item;
            children[index] = null;
        }
    });
    let itemName = loopItem ? loopItem.value : 'item';
    let indexName = loopindex ? loopindex.value : 'index';
    if (loopMain) {
        loopMain.key = 'v-for';
        loopMain.value = `(${itemName},${indexName}) in ${loopMain.value.match(/\{\{(.+)\}\}/)[1]}`;
    }
    if (loopKey) {
        loopKey.key = ':key';
        let loopKeyMatch;
        if (loopKey.value === '*this') loopKey.value = itemName;
        else if (loopKeyMatch = loopKey.value.match(/\{\{(.+)\}\}/)) {
            loopKey.value = loopKeyMatch[1];
        }
        else loopKey.value = `${itemName}.${loopKey.value}`;
    }
    return children.filter(item => item != null);
};



const keyValueConver = obj => {

    if (isFor(obj.key)) return;
    if (typeof obj.value != 'string') return;
    let value = obj.value.trim();
    let expList = value.match(/\{\{[^\{\{\}\}]+\}\}/g);
    if (expList) {
        if (isEvent(obj.key)) obj.key = eventKeyConver(obj.key);
        else if (isIf(obj.key)) obj.key = ifKeyConver(obj.key);
        else if (isModel(obj.key)) obj.key = modelKeyConver(obj.key);
        else obj.key = ':' + obj.key;
        if (/^\{\{[^\{\{\}\}]+\}\}$/.test(value)) {
            obj.value = value.replace(/\{\{/g, '').replace(/\}\}/g, '');
        } else {
            value = value.replace(/\{\{/g, "\' + {{").replace(/\}\}/g, "}} + \'");
            if (value.startsWith("' + {{")) value = value.slice(4);
            else value = "\'" + value;
            if (value.endsWith("}} + '")) value = value.slice(0, -4);
            else value = value + "\'";
            obj.value = value.replace(/\{\{/g, '(').replace(/\}\}/g, ')').replace(/"/g, "\'");
        }
    } else {
        if (isEvent(obj.key)) obj.key = eventKeyConver(obj.key);
        else if (isIf(obj.key)) obj.key = ifKeyConver(obj.key);
        else if (isModel(obj.key)) obj.key = modelKeyConver(obj.key);
    }

};

const conver = xmlJson => {
    let converJson = JSON.parse(JSON.stringify(xmlJson));
    function handle(data) {
        data.forEach(item => {
            if (item.type === 'element') {
                const attributes = item.attributes;
                if (attributes && attributes.length) {
                    attributes.forEach(item => {
                        keyValueConver(item);
                    });
                    item.attributes = forConver(attributes);
                }
                const children = item.children;
                if (children && children.length) handle(children);
            }
        });
    }
    handle(converJson);
    return converJson;

};

module.exports = conver;