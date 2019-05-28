var appkey = "5f6210fcda492071037c6b2af36a770bd60f7c62"
var appsecret = "415765acdc8dc568612f57ad960aef62666bc122f1701101075c296c15b6c4f8"

var appkey = "6bc57c87050b945109db48b81c671d4c403af05c"
var appsecret = "d47369cad0cd411743f5926d12b5695f212efeef3e8aa61f5f7789d17893b623"

var imgUrl = "http://ai.xueersi.com/oralCorrection/images/KPI_1051.jpg"
var apiUrl = "http://openapiai.xueersi.com/v1/api/img/ocr/expreg"
var params = {
    "app_key": appkey,
    // "time_stamp": 1551174536,
    // "nonce_str": "W8FI8oCp",
    "img": null,
    "img_type": "BASE64",
}

var settings = {
    "async": true,
    "crossDomain": true,
    // "url": "http://openapiai.xueersi.com/v1/api/img/ocr/expreg",
    "url": "http://openapiai.xueersi.com/v1/api/img/ocr/general",
    // "url": "127.0.0.1:18092/v1/api/img/ocr/general",
    "method": "POST",
    "headers": {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    "data": null,
}

function objKeySort(obj) { //排序的函数
    var sdic = Object.keys(obj).sort();
    return sdic;
}

function previewFile() {
    var preview = document.querySelector('img');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function() {
        preview.src = reader.result;
        imgUrl = reader.result.replace(/^data:image\/(png|jpg|jpeg|pdf);base64,/, "");
        doUpload(imgUrl)
    }, false);

    if (file) {
        reader.readAsDataURL(file);
    }
}

function doUpload(imgUrl) {
    params.img = imgUrl;
    // params.sign = getSign(params)
    settings.data = params;
    $.ajax(settings).done(function(response) {
        console.log(response);
    });
}

// 安全登录生成
function getSign(params, appsecret) {
    let paramsKey = objKeySort(params)
    var signStr = ""
    for (var k in paramsKey) {
        var key = paramsKey[k]
        signStr = signStr + params[key];
    }
    signStr = signStr + appsecret;
    params.sign = sha1(signStr)
    return params.sign
}

// 字符串加密成 hex 字符串
function sha1(s) {
    var data = new Uint8Array(encodeUTF8(s))
    var i, j, t;
    var l = ((data.length + 8) >>> 6 << 4) + 16,
        s = new Uint8Array(l << 2);
    s.set(new Uint8Array(data.buffer)), s = new Uint32Array(s.buffer);
    for (t = new DataView(s.buffer), i = 0; i < l; i++) s[i] = t.getUint32(i << 2);
    s[data.length >> 2] |= 0x80 << (24 - (data.length & 3) * 8);
    s[l - 1] = data.length << 3;
    var w = [],
        f = [
            function() {
                return m[1] & m[2] | ~m[1] & m[3];
            },
            function() {
                return m[1] ^ m[2] ^ m[3];
            },
            function() {
                return m[1] & m[2] | m[1] & m[3] | m[2] & m[3];
            },
            function() {
                return m[1] ^ m[2] ^ m[3];
            }
        ],
        rol = function(n, c) {
            return n << c | n >>> (32 - c);
        },
        k = [1518500249, 1859775393, -1894007588, -899497514],
        m = [1732584193, -271733879, null, null, -1009589776];
    m[2] = ~m[0], m[3] = ~m[1];
    for (i = 0; i < s.length; i += 16) {
        var o = m.slice(0);
        for (j = 0; j < 80; j++)
            w[j] = j < 16 ? s[i + j] : rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1),
            t = rol(m[0], 5) + f[j / 20 | 0]() + m[4] + w[j] + k[j / 20 | 0] | 0,
            m[1] = rol(m[1], 30), m.pop(), m.unshift(t);
        for (j = 0; j < 5; j++) m[j] = m[j] + o[j] | 0;
    };
    t = new DataView(new Uint32Array(m).buffer);
    for (var i = 0; i < 5; i++) m[i] = t.getUint32(i << 2);

    var hex = Array.prototype.map.call(new Uint8Array(new Uint32Array(m).buffer), function(e) {
        return (e < 16 ? "0" : "") + e.toString(16);
    }).join("");
    return hex;
}

function encodeUTF8(s) {
    var i, r = [],
        c, x;
    for (i = 0; i < s.length; i++)
        if ((c = s.charCodeAt(i)) < 0x80) r.push(c);
        else if (c < 0x800) r.push(0xC0 + (c >> 6 & 0x1F), 0x80 + (c & 0x3F));
    else {
        if ((x = c ^ 0xD800) >> 10 == 0) //对四字节UTF-16转换为Unicode
            c = (x << 10) + (s.charCodeAt(++i) ^ 0xDC00) + 0x10000,
            r.push(0xF0 + (c >> 18 & 0x7), 0x80 + (c >> 12 & 0x3F));
        else r.push(0xE0 + (c >> 12 & 0xF));
        r.push(0x80 + (c >> 6 & 0x3F), 0x80 + (c & 0x3F));
    };
    return r;
}


module.exports = {
  getSign: getSign,
  objKeySort: objKeySort
}
