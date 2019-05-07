
let encoding = require("../encoding.js");



const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 *  这个纯是一个测试。这是测试 
 */
function showtest () {
  let a = '{"id":123,"pid":"你好"}';
  let b = JSON.stringify(a)
  // var fileData = new Uint8Array(b)
  let uint8array = new encoding.TextEncoder().encode(b);
  console.log(uint8array);
  // console.log('diaoyongwole')
  
  console.log(new encoding.TextDecoder().decode(uint8array))

  return uint8array
}

/**
 *  将字符串转化为buffer
 * 
 */
function strToBuffer (str) {
  let uint8array = new encoding.TextEncoder().encode(str);
  return uint8array
}

/**
 *  将buffer转化为字符串
 */
function bufferToStr(fileData) {
  let newfileData = new Uint8Array(fileData.data)
  let dataString = new encoding.TextDecoder().decode(newfileData);
  return dataString
}

/**
 * 链接各个buffer
 */
function concatenate (resultConstructor, ...arrays) {
  let totalLength = 0;
  for (let arr of arrays) {
    totalLength += arr.length;
  }
  let result = new resultConstructor(totalLength);
  let offset = 0;
  for (let arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}


/**
 *  发包整理
 *  可以多个参数一起传进去 
 *  pid 中文/英文 
 *  assess_ref  测评文本内容  你好这是一个测试文本测试的，文本你看怎么样
 *  idx 发包顺序 
 *  !!!!  sid  需要更改， 因为后续要产生一个唯一id 这样更好的抓到问题
 *  newbyteLength1   分包音频
 */

function getDataList(randomNum, assess_ref, idx ,newbyteLength1) {

  let title = 'ai-test' + randomNum
  let sendstr = JSON.stringify({
    "common": {
        "sid": 'SKX-test' + randomNum,  // sid，全局唯一
        "idx": idx,                                      //分段音频的次序 
        "compress": "2"
    },
    "spec": {
        "assess_ref": assess_ref,                  //测评文本 
        "vad_max_sec": "600",                            //默认30s, 说话最大时长 
        "vad_pause_sec": "3",                           //默认5s, 说话后静音停止时间 
        "vad_st_sil_sec": "5",                          //默认为10s, 说话前最大静音时长 
        "sil_tips_sec": "200",                          //静音时长提示，单位是10ms 
        "voiceless_penal": "1",                         //清音惩罚选项，测评单词时对清音发音好坏更敏感
        "multi_sent_loop": "0",                         //单句测评与多句测评模式选项，多句测评模式置为1
        "need_out_wd_sec": "0",                         //测评文本时间码返回选项，返回对应单词或字的起始时间
        "extra": {}                                     //扩展字段，可有可无，方便后续扩展
    },
    "audio": newbyteLength1                             //音频字节流,需要转为二进制流
})

      
  return sendstr
}


function _arrayBufferToBase64(raw) {
  var base64 = '';
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  // var bytes = new Uint8Array(raw);
  var bytes = raw
  var byteLength = bytes.byteLength;
  var byteRemainder = byteLength % 3;
  var mainLength = byteLength - byteRemainder;
  var a, b, c, d;
  var chunk;
  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12; // 258048 = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6; // 4032 = (2^6 - 1) << 6
    d = chunk & 63; // 63 = 2^6 - 1
    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
  }
  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength];
    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2;
    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3 = 2^2 - 1;
    base64 += encodings[a] + encodings[b] + '==';
  }
  else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
    a = (chunk & 16128) >> 8 // 16128 = (2^6 - 1) << 8;
    b = (chunk & 1008) >> 4 // 1008 = (2^6 - 1) << 4;
    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15 = 2^4 - 1;
    base64 += encodings[a] + encodings[b] + encodings[c] + '=';
  }
  return base64;
}


/**
 * 拼接参数
 */
function joinParams(params) {
  let arr = []
  for (let key in params) {
    if (params[key]) {
      if (params[key] !== 'app_secret') {
        arr.push(key + '=' + params[key])
      }

    }
  }
  if (arr.length) {
    return '?' + arr.join('&')
  }
  return ''
}


module.exports = {
  formatTime: formatTime,
  showtest: showtest,
  strToBuffer: strToBuffer,
  bufferToStr: bufferToStr,
  concatenate:concatenate,
  getDataList: getDataList,
  _arrayBufferToBase64: _arrayBufferToBase64,
  joinParams: joinParams

}
